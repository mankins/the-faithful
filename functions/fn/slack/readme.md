# Github to Slack Config Connector Function

Webhook endpoint to relate Github webhook messages to slack's webhook.

# Project Columns

The API doesn't include column names, so we configure here:

Get these by looking for the data-id on the github project page when inspecting the div with the column in it.

```
let columnMap = {};
     columnMap['12726477'] = 'Todo';
     columnMap['12726478'] = 'In progress';
     columnMap['12726479'] = 'Done';

const GITHUB_PROJECT_COLUMNS_JSON = JSON.stringify(columnMap);
```

## Add to `.env`

```
GITHUB_PROJECT_COLUMNS_JSON='{"12726477":"Todo","12726478":"In progress","12726479":"Done"}'
SLACK_ENDPOINT={slack webhook endpoint}
```


