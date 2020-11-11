from glob import glob
import xml.etree.ElementTree as ET
import os
import urllib3
import json

filename = glob('test-results/*.xml')[0]
print(filename)
tree = ET.parse(filename)
root = tree.getroot()
tests = int(root.attrib['tests'])
errors = int(root.attrib['errors'])
failures = int(root.attrib['failures'])
print(str(tests - errors - failures) + " tests passed out of " + str(tests))

message = []

message.append({
    "type": "section",
    "text": {
        "type": "mrkdwn",
        "text": "[" + os.environ.get('APPNAME') + "(" + os.environ.get('STAGE') + ") has been deployed - " + str(tests - errors - failures) + " out of " + str(tests) + " tests passed](" + os.environ.get('GITHUB_SERVER_URL') + "/" + os.environ.get('GITHUB_REPOSITORY') + "/actions/runs/" + os.environ.get('GITHUB_RUN_ID') + ")"
    }
})
# message.append({
#     "type": "divider"
# })
# message.append({
#     "type": "section",
#     "text": {
#         "type": "mrkdwn",
#         "text": str(tests - errors - failures) + " out of " + str(tests) + " tests passed"
#     }
# })
body_data = json.dumps({'blocks': message})

config_slack_endpoint = os.getenv('SLACK_ENDPOINT')
http = urllib3.PoolManager()
r = http.request("POST", config_slack_endpoint, headers={'Content-Type': 'application/json'}, body=body_data)
if r.status != 200:
    raise ValueError('Request to slack returned an error %s, the response is:\n%s' % (r.status, r._body))
