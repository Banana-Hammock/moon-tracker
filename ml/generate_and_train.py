import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error
import ephem
import json
import random
from datetime import datetime, timezone, timedelta

# ─────────────────────────────────────────
# 1. HELPER — compute sun & moon from ephem
# ─────────────────────────────────────────

def get_astro_data(lat, lon, dt):
    obs = ephem.Observer()
    obs.lat = str(lat)
    obs.lon = str(lon)
    obs.date = dt.strftime('%Y/%m/%d %H:%M:%S')
    obs.pressure = 0  # ignore refraction for consistency

    sun = ephem.Sun(obs)
    moon = ephem.Moon(obs)

    sun_alt = float(sun.alt) * 180 / np.pi
    moon_alt = float(moon.alt) * 180 / np.pi
    moon_illum = moon.phase / 100.0  # ephem gives 0-100

    return sun_alt, moon_alt, moon_illum


# ─────────────────────────────────────────
# 2. GROUND TRUTH VISIBILITY FORMULA
# ─────────────────────────────────────────

def compute_visibility(cloud_cover, humidity, wind_speed,
                       weather_code, sun_alt, moon_alt, moon_illum):

    # Moon below horizon — zero visibility
    if moon_alt <= 0:
        return 0.0

    # Base score from cloud cover
    base = 100.0 - cloud_cover

    # Daylight penalty
    if sun_alt > 15:
        base *= 0.05       # full daylight — moon barely visible
    elif sun_alt > 6:
        base *= 0.18       # civil twilight
    elif sun_alt > 0:
        base *= 0.40       # nautical/astronomical twilight

    # Humidity haze
    if humidity > 90:
        base *= 0.55
    elif humidity > 75:
        base *= 0.75
    elif humidity > 60:
        base *= 0.90

    # Weather code penalties
    # Open-Meteo codes: 0=clear,1-3=partly cloudy,45-48=fog,
    # 51-67=drizzle/rain,71-77=snow,80-82=showers,95+=storm
    if weather_code in [45, 48]:
        base *= 0.10       # fog
    elif weather_code >= 95:
        base *= 0.05       # thunderstorm
    elif weather_code >= 80:
        base *= 0.20       # showers
    elif weather_code >= 51:
        base *= 0.30       # drizzle/rain
    elif weather_code >= 71:
        base *= 0.25       # snow

    # Moon altitude penalty — near horizon = more atmosphere
    if moon_alt < 5:
        base *= 0.50
    elif moon_alt < 10:
        base *= 0.70
    elif moon_alt < 20:
        base *= 0.88

    # Illumination — dim moons harder to see
    illum_factor = 0.25 + 0.75 * moon_illum
    base *= illum_factor

    # Wind — very slight positive effect (clears atmosphere)
    if wind_speed > 20:
        base *= 1.05

    return float(np.clip(base, 0, 100))


# ─────────────────────────────────────────
# 3. GENERATE DATASET
# ─────────────────────────────────────────

print("Generating dataset...")

# Indian subcontinent lat/lon ranges
LAT_RANGE = (8.0, 35.0)
LON_RANGE = (68.0, 97.0)

# 2026 date range
START_DATE = datetime(2026, 1, 1, tzinfo=timezone.utc)
END_DATE = datetime(2026, 12, 31, tzinfo=timezone.utc)
DATE_RANGE_DAYS = (END_DATE - START_DATE).days

# Weather code distribution (realistic)
WEATHER_CODES = (
    [0] * 30 +    # clear sky — most common
    [1] * 15 +    # mainly clear
    [2] * 15 +    # partly cloudy
    [3] * 10 +    # overcast
    [45] * 3 +    # fog
    [48] * 2 +    # icy fog
    [51] * 3 +    # light drizzle
    [61] * 4 +    # light rain
    [63] * 3 +    # moderate rain
    [80] * 5 +    # rain showers
    [95] * 3 +    # thunderstorm
    [71] * 2 +    # snow (rare for India)
    [65] * 5      # heavy rain
)

N = 60000
rows = []

for i in range(N):
    if i % 5000 == 0:
        print(f"  {i}/{N} rows generated...")

    lat = random.uniform(*LAT_RANGE)
    lon = random.uniform(*LON_RANGE)
    days_offset = random.randint(0, DATE_RANGE_DAYS)
    hour = random.randint(0, 23)
    dt = START_DATE + timedelta(days=days_offset, hours=hour)

    cloud_cover = random.uniform(0, 100)
    humidity = random.uniform(10, 100)
    wind_speed = random.uniform(0, 40)
    weather_code = random.choice(WEATHER_CODES)

    try:
        sun_alt, moon_alt, moon_illum = get_astro_data(lat, lon, dt)
    except Exception:
        continue

    visibility = compute_visibility(
        cloud_cover, humidity, wind_speed,
        weather_code, sun_alt, moon_alt, moon_illum
    )

    rows.append({
        'cloud_cover': round(cloud_cover, 1),
        'humidity': round(humidity, 1),
        'wind_speed': round(wind_speed, 1),
        'weather_code': weather_code,
        'sun_alt': round(sun_alt, 2),
        'moon_alt': round(moon_alt, 2),
        'moon_illum': round(moon_illum, 3),
        'visibility': round(visibility, 2),
    })

df = pd.DataFrame(rows)
df.to_csv('ml/visibility_training_data.csv', index=False)
print(f"Dataset saved: {len(df)} rows")


# ─────────────────────────────────────────
# 4. TRAIN DECISION TREE
# ─────────────────────────────────────────

print("\nTraining decision tree...")

FEATURES = ['cloud_cover', 'humidity', 'wind_speed',
            'weather_code', 'sun_alt', 'moon_alt', 'moon_illum']

X = df[FEATURES]
y = df['visibility']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

tree = DecisionTreeRegressor(
    max_depth=6,
    min_samples_leaf=50,
    random_state=42
)
tree.fit(X_train, y_train)

y_pred = tree.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)

print("\nErrors for test set:")
print(f"MAE  : {mae:.2f} visibility pts.")
print(f"MSE  : {mse:.2f} visibility pts.")
print(f"RMSE : {rmse:.2f} visibility pts.")



# ─────────────────────────────────────────
# 5. EXPORT TREE AS JSON
# ─────────────────────────────────────────

def tree_to_json(tree_model, feature_names):
    tree_ = tree_model.tree_
    feature_name = [
        feature_names[i] if i != -2 else 'leaf'
        for i in tree_.feature
    ]

    def recurse(node):
        if tree_.feature[node] == -2:
            return {'value': round(float(tree_.value[node][0][0]), 2)}
        return {
            'feature': feature_name[node],
            'threshold': round(float(tree_.threshold[node]), 4),
            'left': recurse(tree_.children_left[node]),
            'right': recurse(tree_.children_right[node]),
        }

    return recurse(0)

print("\nExporting tree to JSON...")
tree_json = tree_to_json(tree, FEATURES)

with open('src/utils/visibilityTree.json', 'w') as f:
    json.dump(tree_json, f, separators=(',', ':'))

print("Tree exported to src/utils/visibilityTree.json")