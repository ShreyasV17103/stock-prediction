# This is a Python script that would be used for the actual price prediction
# In a real application, this would be deployed as an API endpoint

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import json

def fetch_data(symbol, asset_type='stock', timeframe='1d'):
    """
    In a real application, this would fetch data from a financial API
    For this example, we'll generate mock data
    """
    np.random.seed(42)  # For reproducibility
    
    # Generate dates
    end_date = datetime.now()
    
    # Determine start date based on timeframe
    if timeframe == '1d':
        start_date = end_date - timedelta(days=1)
        freq = 'H'  # Hourly data
    elif timeframe == '1w':
        start_date = end_date - timedelta(days=7)
        freq = 'D'  # Daily data
    elif timeframe == '15d':
        start_date = end_date - timedelta(days=15)
        freq = 'D'  # Daily data
    elif timeframe == '3m':
        start_date = end_date - timedelta(days=90)
        freq = 'D'  # Daily data
    elif timeframe == '6m':
        start_date = end_date - timedelta(days=180)
        freq = 'D'  # Daily data
    elif timeframe == '1y':
        start_date = end_date - timedelta(days=365)
        freq = 'W'  # Weekly data
    elif timeframe == '3y':
        start_date = end_date - timedelta(days=365*3)
        freq = 'W'  # Weekly data
    else:
        start_date = end_date - timedelta(days=30)
        freq = 'D'  # Default to daily data
    
    date_range = pd.date_range(start=start_date, end=end_date, freq=freq)
    
    # Set base price and volatility based on asset type and symbol
    if asset_type == 'stock':
        stock_info = {
            'AAPL': {'base_price': 180, 'volatility': 0.015},
            'MSFT': {'base_price': 350, 'volatility': 0.012},
            'GOOGL': {'base_price': 140, 'volatility': 0.018},
            'AMZN': {'base_price': 130, 'volatility': 0.02},
            'META': {'base_price': 300, 'volatility': 0.022},
            'TSLA': {'base_price': 240, 'volatility': 0.03},
            'NVDA': {'base_price': 400, 'volatility': 0.025},
        }
        info = stock_info.get(symbol, {'base_price': 100, 'volatility': 0.02})
    else:  # crypto
        crypto_info = {
            'BTC': {'base_price': 50000, 'volatility': 0.025},
            'ETH': {'base_price': 3000, 'volatility': 0.03},
            'BNB': {'base_price': 400, 'volatility': 0.028},
            'SOL': {'base_price': 100, 'volatility': 0.04},
            'XRP': {'base_price': 0.5, 'volatility': 0.035},
            'ADA': {'base_price': 0.4, 'volatility': 0.038},
        }
        info = crypto_info.get(symbol, {'base_price': 10, 'volatility': 0.03})
    
    base_price = info['base_price']
    volatility = info['volatility']
    
    # Generate prices with a trend and some randomness
    trend = 0.001  # Upward trend
    
    # Generate OHLCV data
    data = []
    price = base_price
    
    for date in date_range:
        # Random price movement with trend
        change_percent = (np.random.normal(0, volatility) + trend)
        change = price * change_percent
        
        # Generate OHLC
        open_price = price
        close_price = price + change
        high_low_range = abs(open_price - close_price) * (1 + np.random.random())
        high_price = max(open_price, close_price) + high_low_range / 2
        low_price = min(open_price, close_price) - high_low_range / 2
        
        # Volume is proportional to price movement
        volume = base_price * 1000 * (1 + np.random.random() * abs(change_percent) * 10)
        
        data.append({
            'date': date,
            'open': open_price,
            'high': high_price,
            'low': low_price,
            'close': close_price,
            'volume': volume
        })
        
        price = close_price  # Update price for next iteration
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    return df

def prepare_features(df, window_size=10):
    """
    Prepare features for the prediction model
    """
    # Create features based on previous prices
    features = pd.DataFrame(index=df.index)
    
    # Add previous prices as features
    for i in range(1, window_size + 1):
        features[f'close_lag_{i}'] = df['close'].shift(i)
    
    # Add technical indicators
    # Simple Moving Average
    features['sma_5'] = df['close'].rolling(window=5).mean()
    features['sma_10'] = df['close'].rolling(window=10).mean()
    
    # Exponential Moving Average
    features['ema_5'] = df['close'].ewm(span=5, adjust=False).mean()
    features['ema_10'] = df['close'].ewm(span=10, adjust=False).mean()
    
    # MACD
    features['macd'] = df['close'].ewm(span=12, adjust=False).mean() - df['close'].ewm(span=26, adjust=False).mean()
    
    # Bollinger Bands
    features['bb_middle'] = df['close'].rolling(window=20).mean()
    features['bb_std'] = df['close'].rolling(window=20).std()
    features['bb_upper'] = features['bb_middle'] + 2 * features['bb_std']
    features['bb_lower'] = features['bb_middle'] - 2 * features['bb_std']
    
    # Relative Strength Index (RSI)
    delta = df['close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    features['rsi_14'] = 100 - (100 / (1 + rs))
    
    # Volatility
    features['volatility_5'] = df['close'].rolling(window=5).std()
    features['volatility_10'] = df['close'].rolling(window=10).std()
    
    # Volume indicators
    features['volume_sma_5'] = df['volume'].rolling(window=5).mean()
    features['volume_ratio'] = df['volume'] / features['volume_sma_5']
    
    # Price change
    features['price_change_1'] = df['close'].pct_change(1)
    features['price_change_5'] = df['close'].pct_change(5)
    
    # Drop NaN values
    features = features.dropna()
    
    # Target variable (next period's price)
    target = df['close'].shift(-1).loc[features.index]
    
    return features, target

def train_prediction_model(features, target, timeframe):
    """
    Train a machine learning model for price prediction
    """
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(
        features, target, test_size=0.2, shuffle=False
    )
    
    # Scale features
    scaler = MinMaxScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Make predictions on test set
    y_pred = model.predict(X_test_scaled)
    
    # Calculate metrics
    mse = np.mean((y_pred - y_test) ** 2)
    rmse = np.sqrt(mse)
    mae = np.mean(np.abs(y_pred - y_test))
    
    print(f"Model Performance for {timeframe} timeframe:")
    print(f"Mean Squared Error: {mse:.4f}")
    print(f"Root Mean Squared Error: {rmse:.4f}")
    print(f"Mean Absolute Error: {mae:.4f}")
    
    return model, scaler, X_test, y_test, y_pred

def predict_future_prices(model, scaler, last_features, timeframe):
    """
    Predict future prices based on timeframe
    """
    # Determine number of intervals to predict
    if timeframe == '1d':
        intervals = 24  # 24 hours
    elif timeframe == '1w':
        intervals = 7  # 7 days
    elif timeframe == '15d':
        intervals = 15  # 15 days
    elif timeframe == '3m':
        intervals = 12  # 12 weeks
    elif timeframe == '6m':
        intervals = 24  # 24 weeks
    elif timeframe == '1y':
        intervals = 12  # 12 months
    elif timeframe == '3y':
        intervals = 36  # 36 months
    else:
        intervals = 30  # Default
    
    # Make a copy of the last features
    future_features = last_features.iloc[-1:].copy()
    
    predictions = []
    lower_bounds = []
    upper_bounds = []
    
    # Confidence interval width (increases with time to reflect growing uncertainty)
    base_confidence = 0.05
    
    for day in range(1, intervals + 1):
        # Scale the features
        scaled_features = scaler.transform(future_features)
        
        # Predict the next price
        predicted_price = model.predict(scaled_features)[0]
        
        # Add confidence intervals (wider as we predict further into the future)
        confidence_interval = predicted_price * (base_confidence + day * 0.002)
        lower_bound = predicted_price - confidence_interval
        upper_bound = predicted_price + confidence_interval
        
        # Store predictions
        predictions.append(predicted_price)
        lower_bounds.append(lower_bound)
        upper_bounds.append(upper_bound)
        
        # Update features for the next prediction
        # Shift previous prices
        for i in range(10, 1, -1):
            future_features[f'close_lag_{i}'] = future_features[f'close_lag_{i-1}']
        
        future_features['close_lag_1'] = predicted_price
        
        # Update other technical indicators (simplified for this example)
        # In a real application, these would be properly updated based on the new price
        
    return predictions, lower_bounds, upper_bounds

def main():
    # Example usage
    symbol = "AAPL"
    asset_type = "stock"
    timeframe = "3m"
    
    print(f"Fetching {asset_type} data for {symbol} with {timeframe} timeframe...")
    
    # Fetch historical data
    df = fetch_data(symbol, asset_type, timeframe)
    
    # Prepare features
    print("Preparing features...")
    features, target = prepare_features(df)
    
    # Train model
    print("Training prediction model...")
    model, scaler, X_test, y_test, y_pred = train_prediction_model(features, target, timeframe)
    
    # Predict future prices
    print("Predicting future prices...")
    predictions, lower_bounds, upper_bounds = predict_future_prices(
        model, scaler, features.iloc[-1:], timeframe
    )
    
    # Create prediction results
    prediction_results = []
    for day in range(len(predictions)):
        prediction_results.append({
            "day": day + 1,
            "prediction": round(float(predictions[day]), 4),
            "lower_bound": round(float(lower_bounds[day]), 4),
            "upper_bound": round(float(upper_bounds[day]), 4)
        })
    
    # Print sample of predictions
    print("\nPrediction Sample (first 5 intervals):")
    for i in range(min(5, len(prediction_results))):
        print(f"Interval {i+1}: ${prediction_results[i]['prediction']:.4f} " +
            f"(Range: ${prediction_results[i]['lower_bound']:.4f} - " +
            f"${prediction_results[i]['upper_bound']:.4f})")
    
    # In a real application, this would return the predictions as JSON
    # return json.dumps(prediction_results)

if __name__ == "__main__":
    main()

