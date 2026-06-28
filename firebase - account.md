1. 

npm install firebase 

// Import the functions you need from the SDKs you need 

import { initializeApp } from "firebase/app"; 

// TODO: Add SDKs for Firebase products that you want to use 

// https://firebase.google.com/docs/web/setup#available-libraries 

// Your web app's Firebase configuration 

const firebaseConfig = { 

apiKey: "AIzaSyAjuHbfbGYXLc1GaBC5lMBY3kC_0LzrD-0", 

authDomain: "vivekdefenceacademy.firebaseapp.com", 

projectId: "vivekdefenceacademy", 

storageBucket: "vivekdefenceacademy.firebasestorage.app", 

messagingSenderId: "740938312305", 

appId: "1:740938312305:web:73c45f97f89682d48949d0" 

}; 

// Initialize Firebase 

const app = initializeApp(firebaseConfig); 

## 2 .  { 

"type": "service_account", 

"project_id": "vivekdefenceacademy", 

"private_key_id": "a3604c5c6d0cfd3ebbce2fb2d7dd6c52a5796906", 

"private_key": "-----BEGIN PRIVATE KEY----- 

\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDEh4rFEY0dWShk\ne cmflo2b5plR+lM4Yeatt29asaS2VwT5S7Q5SQwf+v9O4w2Ep+JqNFYKfik7G/MG\nMN5gl bDBXD3/310E1mrreBEOonw+3sAr2QryfEEmJdnyMMTZUtHwnJcEX7O90m1i\nf+8dbhrq y6/JTvMi12AChCOc+I+bZrXqQ0MltnsnAaDgDgcprPJsPURQGJbcEHVY\npHshB+a8q1Z0 

Lxbam5W/tZ72DqEvqeqziU+dUbnfkhxys0iGUa2E921m1y67r41Y\nnNF5yXcLhA/vWMKv n4RO7bSSznqpw9ec+ktH1e0rmJQYihIbu4rgG7eIoxEFTQJR\nOfgUHnrvAgMBAAECggEA E4p38Cuplf8fzAsWqB6RIAI9a8WccWESow032OhhkfEf\nFnvs2ealz6bmVygDrRVVpu0N 7RHUSa34FmfU2fz9oTbpwepUq77MzMhDHJW9YtxF\nIVb9sVSiKbKJHtKzOqSd0/MjSj+1 yyxZd090gr7y6uEBLolXauHICG1ZGSosepf+\n51wLMi0MFUcsz8Y23PIwhnP7RQDe33vt kj7LZnn9TN2lBtcYPQgQaMsYXEm++XHC\n8HohgYYVn74QZid2rbrsmdiZiVan7eQPdTCJ v3Nm5v7lrCO1Tuj4SXqUofD9A72B\neBTbfNJP4424vMlT8mYQRkBft9G7vc4VuAYVIJaH8 QKBgQDjGuCleAJ7LIlG9bQ9\nkey+tAPv3TVQaGgPlIbqSSeiC1lAZcwLKL0Zg+HpqHaznC yEZJbet5CyPfm5/Q0K\n+IHwXk1egGvtt7+iOZh+UKUNdNZ8LPDOtZEyoLAf3SLtdyxv3YE P0wxVncV4ttbg\nnNhNIKD0SWianEIijvui4N8KWQKBgQDdiMcFntE7RjQENWzQ63rlczE alMySo6+j\nFaVClpSm2P0MrIwR9mXi7sEiDr60vCyZg8VNW3h9OIEv8ULkmmKuaiz/BJU 9dUpd\n+F9xw84Pr9Qx9lcU8IZUabssbKOyM9dav1fHEJBdJCJ6rq9GdXjDWNAoiBKoMM q5\nzef2oDN2hwKBgBi1Id+esNZpv/2iWZuhNpqAxzTfYh9/XGLli9ANaWxtw6YH7S0B\nn 6EZAgkDtPZRdV5p+yf73JgnufWMHFEnPCvEdrJjUlqodQbXMUn8yBgwr+0OjpxO\nkJ9rb/ 3ndxdSsdjxxkrMcTkXUxaQ/cuuBLJPbHNnUSQQ//j2iVXtFRbxAoGBANqZ\npjHwlmwUCS 4B/d9mDf4uHc0p+XfVl3Go4UsExaiiQ4lnFkx/Q+ibSe6ueBZl/Oh6\n840y7oE56ZiCTEzB3 xBWaxI11oIvo/N4K85ZtZMbIJswhpt+AD95mZ3rkdg9eYrt\ndtNSj/Gov3EpwIEZV9IDaFw mcaqPguu3t+ZQDJgvAoGBAIJEnWGP+vfjcy9e/1ke\nB6nl4aQB867HZESRp6Cy/UM8xV5 FufMWdfKQXSs2dZc8IJE4xoWoJnJBcGyBPUpU\nEzzK/dFOCYPIIW3DrYJm7tTkY5u20AA RHcdrcY6hN1HqwQhLP2RX0Z8sdw035l3u\nfz8lvRZdtSWYfX4m3nM8J+u4\n-----END PRIVATE KEY-----\n", 

"client_email": "firebase-adminsdkfbsvc@vivekdefenceacademy.iam.gserviceaccount.com", 

"client_id": "117620776734747349230", 

"auth_uri": "https://accounts.google.com/o/oauth2/auth", 

"token_uri": "https://oauth2.googleapis.com/token", 

"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", 

"client_x509_cert_url": 

"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdkfbsvc%40vivekdefenceacademy.iam.gserviceaccount.com", 

"universe_domain": "googleapis.com" 

} 

