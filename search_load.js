import { check,fail } from "k6";
import http from "k6/http";


export const options = {
    scenarios: {
        search_load_test_with_constant_vus: {
            executor: 'constant-vus',
            vus: 2,
            duration: '1m',
            gracefulStop: '10s',
            exec: 'search_load_test'
        }
    },
    discardResponseBodies: false,
    thresholds: {
        'http_req_failed{scenario:get_tags_of_asset_heavy_load_test}': ['rate<0.01'], // http errors should be less than 1%
        'http_req_duration{scenario:delete_configuration_load_test}': ['p(95)<500'], // 95% of requests should be below 500ms
      }
}

export function search_load_test() {
    const url = `https://www.n11.com/arama?q=test`
    /*const params = {
        headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJzdWIiOiJodHRwczovL3d3dy5uZXRzcGFya2VyY2xvdWQuY29tLyIsImF1ZCI6ImRpc2NvLXN2YyIsInN5c3RlbV90eXBlIjoiaWUtdXMiLCJpc3MiOiJJbnZpY3RpIFNlY3VyaXR5IEx0ZCIsIm5iZiI6MTY5MzI5MzY1NCwiZXhwIjoxNzg3OTg4MDU0LCJpYXQiOjE2OTMyOTM2NTV9.q10H2AUwj4AqirX_4QnoS5f6fo4HzYcN8fE6fw5Ihxpvji9s8YUEF3ScXm-jI5SmK3BWjutZEvXfuqGoCmn7YA'
        }
    }*/
    const res = http.get(url, null);
    const checkOutput = check(
        res,
        {
          'response code was 200': (res) => res.status == 200
        }
      );
    if (!checkOutput) {
        console.error(`HTTP Status Code: ${res.status} | Response body: ${res.body}`) 
        fail('unexpected response');
    }
}