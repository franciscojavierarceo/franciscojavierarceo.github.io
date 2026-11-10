"""Workshop elastic-net penalty; no network or external packages."""
import json

def elastic_net_penalty(coefficients, alpha, lambda_value):
    l1 = sum(abs(value) for value in coefficients)
    l2 = sum(value * value for value in coefficients) / 2
    return lambda_value * (alpha * l2 + (1 - alpha) * l1)

if __name__ == "__main__":
    print(json.dumps({"coefficients": [1, -2, 0.5], "alpha": 0.7,
                      "lambda_value": 0.2,
                      "penalty": elastic_net_penalty([1, -2, 0.5], 0.7, 0.2)}))
