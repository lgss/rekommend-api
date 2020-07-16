import unittest
import requests
import os


class ApiTests(unittest.TestCase):
    def test_api_response_200(self):
        response = requests.get(os.getenv('REKOMMEND_API_URL') + '/journeys')
        self.assertEqual(response.status_code, 200)

    def test_api_editor_response_200(self):
        response = requests.get(
            os.getenv('REKOMMEND_EDITOR_API_URL') + '/journeys')
        self.assertEqual(response.status_code, 200)
