# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.pipeline import Pipeline
# from sklearn.compose import ColumnTransformer
# from sklearn.preprocessing import OneHotEncoder, StandardScaler
# from sklearn.impute import SimpleImputer
# from sklearn.ensemble import GradientBoostingRegressor
# import joblib
# import shap

# from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
# import numpy as np


# # Load dataset
# df = pd.read_csv("../Dataset/MEPS_Cleaned_Full_Dataset.csv")

# # Target variable
# target = "Total_Expenditures_2021"

# # 1️⃣ Remove rows with missing target
# df = df.dropna(subset=[target])

# # Separate features & target
# y = df[target]
# X = df.drop(columns=[target])

# # Identify categorical & numeric columns
# categorical_cols = X.select_dtypes(include=["object", "category"]).columns.tolist()
# numerical_cols = X.select_dtypes(include=["int64", "float64"]).columns.tolist()

# # 2️⃣ Preprocessing Pipelines
# numeric_transformer = Pipeline(steps=[
#     ("imputer", SimpleImputer(strategy="mean")),
#     ("scaler", StandardScaler())
# ])

# categorical_transformer = Pipeline(steps=[
#     ("imputer", SimpleImputer(strategy="most_frequent")),
#     ("onehot", OneHotEncoder(handle_unknown="ignore"))
# ])

# preprocessor = ColumnTransformer(
#     transformers=[
#         ("num", numeric_transformer, numerical_cols),
#         ("cat", categorical_transformer, categorical_cols)
#     ]
# )

# # 3️⃣ Model Pipeline
# pipeline = Pipeline(steps=[
#     ("preprocessor", preprocessor),
#     ("model", GradientBoostingRegressor())
# ])

# # 4️⃣ Train-test split
# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, random_state=42
# )

# # 5️⃣ Fit model
# pipeline.fit(X_train, y_train)

# # 6️⃣ Save model & SHAP explainer
# joblib.dump(pipeline, "model.joblib")

# # Use transformed training data for SHAP
# X_train_transformed = pipeline.named_steps["preprocessor"].transform(X_train)
# explainer = shap.Explainer(pipeline.named_steps["model"], X_train_transformed)
# joblib.dump(explainer, "explainer.joblib")

# print("✅ Model and explainer saved successfully after preprocessing.")

# # Make predictions on test set
# y_pred = pipeline.predict(X_test)

# # Evaluate
# mae = mean_absolute_error(y_test, y_pred)
# rmse = np.sqrt(mean_squared_error(y_test, y_pred))
# r2 = r2_score(y_test, y_pred)

# print(f"MAE: {mae:.2f}")
# print(f"RMSE: {rmse:.2f}")
# print(f"R² Score: {r2:.2f}")




# Install once per environment
#new
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import r2_score
import joblib
import shap
import warnings

warnings.filterwarnings('ignore')

print("--- Starting Model Training (without chronic_conditions) ---")

# 1. Load the augmented dataset
df = pd.read_csv("../Dataset/AugmentedData.csv")
target = "charges_adjusted"  # Adjusted charges after adding chronic conditions
print(f"Dataset loaded. Shape: {df.shape}")

# 2. Define Features (X) and Target (y)
y = np.log1p(df[target])
# **FIX:** Drop the target AND the chronic_conditions column
X = df.drop(columns=[target, 'charges', 'chronic_conditions'])

# 3. Identify Column Types
categorical_cols = X.select_dtypes(include=["object", "category"]).columns.tolist()
numerical_cols = X.select_dtypes(include=["int64", "float64"]).columns.tolist()

print(f"Found {len(categorical_cols)} categorical and {len(numerical_cols)} numerical columns.")

# 4. Create Preprocessing Pipelines
numeric_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])
categorical_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False, drop='first'))
])
preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_transformer, numerical_cols),
        ("cat", categorical_transformer, categorical_cols)
    ],
    remainder='passthrough'
)

# 5. Create the Final Model Pipeline
pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("model", GradientBoostingRegressor(random_state=42))
])

# 6. Train the Model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print("🚀 Fitting the pipeline on the new training data...")
pipeline.fit(X_train, y_train)
print("✅ Pipeline training complete.")

# Evaluate the final model
y_pred = pipeline.predict(X_test)
r2 = r2_score(y_test, y_pred)
print(f"\nFinal Model R² Score on Test Set: {r2:.4f}")

# 7. Save the Final Pipeline and Explainer
joblib.dump(pipeline, "model.joblib")
print("✅ Model pipeline saved to model.joblib")

X_train_transformed = pipeline.named_steps["preprocessor"].transform(X_train)
explainer = shap.Explainer(pipeline.named_steps["model"], X_train_transformed)
joblib.dump(explainer, "explainer.joblib")
print("✅ SHAP explainer saved to explainer.joblib")

print("\n🎉 New backend artifacts created successfully!")







# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.pipeline import Pipeline
# from sklearn.compose import ColumnTransformer
# from sklearn.preprocessing import OneHotEncoder, StandardScaler
# from sklearn.impute import SimpleImputer
# from sklearn.ensemble import GradientBoostingRegressor
# from sklearn.metrics import r2_score
# import joblib
# import shap
# import warnings

# warnings.filterwarnings('ignore')

# print("--- Starting Model Training on Augmented Kaggle Dataset ---")

# # 1. Load the new augmented dataset
# df = pd.read_csv("../Dataset/AugmentedData.csv")
# target = "charges_adjusted"  # Adjusted charges after adding chronic conditions
# print(f"Dataset loaded. Shape: {df.shape}")

# # 2. Define Features (X) and Target (y)
# # Apply log transformation to the target variable to handle skewness
# y = np.log1p(df[target])
# # Drop the target and any other non-feature columns
# X = df.drop(columns=[target, 'charges'])

# # 3. Identify Column Types
# categorical_cols = X.select_dtypes(include=["object", "category"]).columns.tolist()
# numerical_cols = X.select_dtypes(include=["int64", "float64"]).columns.tolist()

# print(f"Found {len(categorical_cols)} categorical and {len(numerical_cols)} numerical columns.")

# # 4. Create Preprocessing Pipelines
# numeric_transformer = Pipeline(steps=[
#     ("imputer", SimpleImputer(strategy="median")),
#     ("scaler", StandardScaler())
# ])

# categorical_transformer = Pipeline(steps=[
#     ("imputer", SimpleImputer(strategy="most_frequent")),
#     ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False, drop='first'))
# ])

# # Create the master preprocessor
# preprocessor = ColumnTransformer(
#     transformers=[
#         ("num", numeric_transformer, numerical_cols),
#         ("cat", categorical_transformer, categorical_cols)
#     ],
#     remainder='passthrough'
# )

# # 5. Create the Final Model Pipeline with Gradient Boosting
# # This was identified as the best model in previous steps
# gbr_params = {
#     'n_estimators': 200,
#     'learning_rate': 0.05,
#     'max_depth': 3,
#     'subsample': 0.9,
#     'random_state': 42
# }
# pipeline = Pipeline(steps=[
#     ("preprocessor", preprocessor),
#     ("model", GradientBoostingRegressor(**gbr_params))
# ])

# # 6. Train the Model
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
# print("🚀 Fitting the pipeline on the new augmented training data...")
# pipeline.fit(X_train, y_train)
# print("✅ Pipeline training complete.")

# # Evaluate the final model
# y_pred = pipeline.predict(X_test)
# r2 = r2_score(y_test, y_pred)
# print(f"\nFinal Model R² Score on Test Set: {r2:.4f}")


# # 7. Save the Final Pipeline
# joblib.dump(pipeline, "model.joblib")
# print("✅ Model pipeline saved to model.joblib")

# # 8. Create and Save the SHAP Explainer for the backend
# print("⚙️ Creating SHAP explainer...")
# X_train_transformed = pipeline.named_steps["preprocessor"].transform(X_train)
# explainer = shap.Explainer(pipeline.named_steps["model"], X_train_transformed)
# joblib.dump(explainer, "explainer.joblib")
# print("✅ SHAP explainer saved to explainer.joblib")

# print("\n🎉 New backend artifacts created successfully!")







# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import StandardScaler, OneHotEncoder
# from sklearn.compose import ColumnTransformer
# from sklearn.pipeline import Pipeline
# from sklearn.metrics import mean_squared_error, r2_score
# from sklearn.linear_model import LinearRegression
# from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
# from sklearn.svm import SVR
# from sklearn.neighbors import KNeighborsRegressor
# from sklearn.impute import SimpleImputer  # NEW for handling NaNs

# # 1. Load dataset
# df = pd.read_csv("../Dataset/MEPS_Cleaned_Full_Dataset.csv")

# # 2. Separate features (X) and target (y)
# target_column = 'Total_Expenditures_2022'  # Replace with your actual target column
# df = df.dropna(subset=[target_column])

# X = df.drop(columns=[target_column])

# y = df[target_column]

# # 3. Identify categorical and numerical columns
# categorical_cols = X.select_dtypes(include=['object', 'category']).columns.tolist()
# numerical_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()

# # 4. Preprocessing (with missing value handling)
# numeric_transformer = Pipeline(steps=[
#     ('imputer', SimpleImputer(strategy='median')),  # Fill NaNs in numeric columns
#     ('scaler', StandardScaler())
# ])

# categorical_transformer = Pipeline(steps=[
#     ('imputer', SimpleImputer(strategy='most_frequent')),  # Fill NaNs in categorical columns
#     ('onehot', OneHotEncoder(handle_unknown='ignore'))
# ])

# preprocessor = ColumnTransformer(
#     transformers=[
#         ('num', numeric_transformer, numerical_cols),
#         ('cat', categorical_transformer, categorical_cols)
#     ]
# )

# # 5. Models to compare
# models = {
#     "Linear Regression": LinearRegression(),
#     "Random Forest": RandomForestRegressor(random_state=42),
#     "Gradient Boosting": GradientBoostingRegressor(random_state=42),
#     "Support Vector Regressor": SVR(),
#     "KNN Regressor": KNeighborsRegressor()
# }

# results = []

# # 6. Train/test split
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # 7. Train and evaluate each model
# for name, model in models.items():
#     pipeline = Pipeline(steps=[
#         ('preprocessor', preprocessor),
#         ('model', model)
#     ])
    
#     pipeline.fit(X_train, y_train)
#     y_pred = pipeline.predict(X_test)
    
#     r2 = r2_score(y_test, y_pred)
#     rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
#     results.append({"Model": name, "R2 Score": r2, "RMSE": rmse})

# # 8. Show results
# results_df = pd.DataFrame(results)
# print("\nModel Comparison:")
# print(results_df.sort_values(by="R2 Score", ascending=False))

# # 9. Best model
# best_model = results_df.sort_values(by="R2 Score", ascending=False).iloc[0]
# print(f"\n✅ Best Model: {best_model['Model']} with R2 = {best_model['R2 Score']:.4f} and RMSE = {best_model['RMSE']:.4f}")
