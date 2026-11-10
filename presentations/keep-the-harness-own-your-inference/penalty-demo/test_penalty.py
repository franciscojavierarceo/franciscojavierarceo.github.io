import unittest
from penalty import elastic_net_penalty

class PenaltyTests(unittest.TestCase):
    def test_mixed_penalty(self):
        self.assertAlmostEqual(elastic_net_penalty([1, -2, .5], .7, .2), .6475)
    def test_lasso(self):
        self.assertAlmostEqual(elastic_net_penalty([1, -2, .5], 1, .2), .7)
    def test_ridge(self):
        self.assertAlmostEqual(elastic_net_penalty([1, -2, .5], 0, .2), .525)

if __name__ == '__main__':
    unittest.main()
