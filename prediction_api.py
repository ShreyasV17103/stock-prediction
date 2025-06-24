from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Literal
import prediction_model

app = FastAPI()

class PredictionRequest(BaseModel):
    symbol: str
    asset_type: Literal['stock', 'crypto'] = 'stock'
    timeframe: str = '3m'

class PredictionResult(BaseModel):
    interval: int
    prediction: float
    lower_bound: float
    upper_bound: float

class PredictionResponse(BaseModel):
    symbol: str
    asset_type: str
    timeframe: str
    predictions: List[PredictionResult]

@app.post('/predict', response_model=PredictionResponse)
def predict_price(req: PredictionRequest):
    try:
        df = prediction_model.fetch_data(req.symbol, req.asset_type, req.timeframe)
        features, target = prediction_model.prepare_features(df)
        model, scaler, X_test, y_test, y_pred = prediction_model.train_prediction_model(features, target, req.timeframe)
        predictions, lower_bounds, upper_bounds = prediction_model.predict_future_prices(
            model, scaler, features.iloc[-1:], req.timeframe
        )
        results = [
            PredictionResult(
                interval=i+1,
                prediction=round(float(predictions[i]), 4),
                lower_bound=round(float(lower_bounds[i]), 4),
                upper_bound=round(float(upper_bounds[i]), 4)
            ) for i in range(len(predictions))
        ]
        return PredictionResponse(
            symbol=req.symbol,
            asset_type=req.asset_type,
            timeframe=req.timeframe,
            predictions=results
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 