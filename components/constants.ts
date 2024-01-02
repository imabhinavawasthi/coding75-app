const company_tags_unsorted =
  [
    ['accenture', 'Accenture', '<Accenture Logo Link>'],
    ['adobe', 'Adobe', '<Adobe Logo Link>'],
    ['agoda', 'Agoda', '<Agoda Logo Link>'],
    ['airbnb', 'Airbnb', '<Airbnb Logo Link>'],
    ['alibaba', 'Alibaba', '<Alibaba Logo Link>'],
    ['amazon', 'Amazon', '<Amazon Logo Link>'],
    [
      'american-express',
      'American Express',
      '<American Express Logo Link>'
    ],
    ['apple', 'Apple', '<Apple Logo Link>'],
    ['arcesium', 'Arcesium', '<Arcesium Logo Link>'],
    [
      'arista-networks',
      'Arista Networks',
      '<Arista Networks Logo Link>'
    ],
    ['atlassian', 'Atlassian', '<Atlassian Logo Link>'],
    ['barclays', 'Barclays', '<Barclays Logo Link>'],
    ['blackrock', 'BlackRock', '<BlackRock Logo Link>'],
    ['bloomberg', 'Bloomberg', '<Bloomberg Logo Link>'],
    ['bny-mellon', 'BNY Mellon', '<BNY Mellon Logo Link>'],
    ['booking-com', 'Booking.com', '<Booking.com Logo Link>'],
    ['cisco', 'Cisco', '<Cisco Logo Link>'],
    ['citadel', 'Citadel', '<Citadel Logo Link>'],
    ['coinbase', 'Coinbase', '<Coinbase Logo Link>'],
    ['databricks', 'Databricks', '<Databricks Logo Link>'],
    ['de-shaw', 'DE Shaw', '<DE Shaw Logo Link>'],
    ['deloitte', 'Deloitte', '<Deloitte Logo Link>'],
    ['deutsche-bank', 'Deutsche Bank', '<Deutsche Bank Logo Link>'],
    ['docusign', 'Docusign', '<Docusign Logo Link>'],
    ['doordash', 'DoorDash', '<DoorDash Logo Link>'],
    ['dropbox', 'Dropbox', '<Dropbox Logo Link>'],
    ['ebay', 'eBay', '<eBay Logo Link>'],
    ['epic-systems', 'Epic Systems', '<Epic Systems Logo Link>'],
    ['expedia', 'Expedia', '<Expedia Logo Link>'],
    [
      'facebook',
      'Facebook',
      'https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png'
    ],
    ['flipkart', 'Flipkart', '<Flipkart Logo Link>'],
    ['godaddy', 'GoDaddy', '<GoDaddy Logo Link>'],
    ['goldman-sachs', 'Goldman Sachs', '<Goldman Sachs Logo Link>'],
    [
      'google',
      'Google',
      'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg'
    ],
    ['grab', 'Grab', '<Grab Logo Link>'],
    ['grammarly', 'Grammarly', '<Grammarly Logo Link>'],
    ['huawei', 'Huawei', '<Huawei Logo Link>'],
    ['ibm', 'IBM', '<IBM Logo Link>'],
    ['indeed', 'Indeed', '<Indeed Logo Link>'],
    ['infosys', 'Infosys', '<Infosys Logo Link>'],
    ['intel', 'Intel', '<Intel Logo Link>'],
    ['intuit', 'Intuit', '<Intuit Logo Link>'],
    ['jane-street', 'Jane Street', '<Jane Street Logo Link>'],
    ['jpmorgan', 'JPMorgan', '<JPMorgan Logo Link>'],
    ['karat', 'Karat', '<Karat Logo Link>'],
    ['linkedin', 'LinkedIn', '<LinkedIn Logo Link>'],
    ['make-my-trip', 'MakeMyTrip', '<MakeMyTrip Logo Link>'],
    ['mathworks', 'MathWorks', '<MathWorks Logo Link>'],
    ['media-net', 'Media.net', '<Media.net Logo Link>'],
    ['microsoft', 'Microsoft', '<Microsoft Logo Link>'],
    ['mongodb', 'MongoDB', '<MongoDB Logo Link>'],
    ['morgan-stanley', 'Morgan Stanley', '<Morgan Stanley Logo Link>'],
    ['netflix', 'Netflix', '<Netflix Logo Link>'],
    ['niantic', 'Niantic', '<Niantic Logo Link>'],
    ['nutanix', 'Nutanix', '<Nutanix Logo Link>'],
    ['nvidia', 'Nvidia', '<Nvidia Logo Link>'],
    ['optiver', 'Optiver', '<Optiver Logo Link>'],
    ['oracle', 'Oracle', '<Oracle Logo Link>'],
    ['other', 'Other'],
    [
      'palo-alto-networks',
      'Palo Alto Networks',
      '<Palo Alto Networks Logo Link>'
    ],
    ['paypal', 'PayPal', '<PayPal Logo Link>'],
    ['paytm', 'Paytm', '<Paytm Logo Link>'],
    ['phonepe', 'PhonePe', '<PhonePe Logo Link>'],
    ['pinterest', 'Pinterest', '<Pinterest Logo Link>'],
    ['qualcomm', 'Qualcomm', '<Qualcomm Logo Link>'],
    ['quora', 'Quora', '<Quora Logo Link>'],
    ['reddit', 'Reddit', '<Reddit Logo Link>'],
    ['rippling', 'Rippling', '<Rippling Logo Link>'],
    ['rubrik', 'Rubrik', '<Rubrik Logo Link>'],
    ['salesforce', 'Salesforce', '<Salesforce Logo Link>'],
    ['samsung', 'Samsung', '<Samsung Logo Link>'],
    ['sap', 'SAP', '<SAP Logo Link>'],
    ['servicenow', 'ServiceNow', '<ServiceNow Logo Link>'],
    ['shopee', 'Shopee', '<Shopee Logo Link>'],
    ['snapchat', 'Snapchat', '<Snapchat Logo Link>'],
    ['snowflake', 'Snowflake', '<Snowflake Logo Link>'],
    ['splunk', 'Splunk', '<Splunk Logo Link>'],
    ['spotify', 'Spotify', '<Spotify Logo Link>'],
    ['square', 'Square', '<Square Logo Link>'],
    ['stripe', 'Stripe', '<Stripe Logo Link>'],
    ['tcs', 'TCS', '<TCS Logo Link>'],
    ['tesla', 'Tesla', '<Tesla Logo Link>'],
    ['tiktok', 'TikTok', '<TikTok Logo Link>'],
    ['twilio', 'Twilio', '<Twilio Logo Link>'],
    ['twitter', 'Twitter', '<Twitter Logo Link>'],
    ['uber', 'Uber', '<Uber Logo Link>'],
    ['visa', 'Visa', '<Visa Logo Link>'],
    ['vmware', 'VMware', '<VMware Logo Link>'],
    ['walmart-labs', 'Walmart Labs', '<Walmart Labs Logo Link>'],
    ['wayfair', 'Wayfair', '<Wayfair Logo Link>'],
    ['wix', 'Wix', '<Wix Logo Link>'],
    ['yahoo', 'Yahoo', '<Yahoo Logo Link>'],
    ['zoho', 'Zoho', '<Zoho Logo Link>'],
    ['zscaler', 'ZScaler', '<ZScaler Logo Link>'],
    ['yandex', 'Yandex', '<Logo Link>'],
    ['bytedance', 'ByteDance', '<Logo Link>'],
    ['roblox', 'Roblox', '<Logo Link>'],
    ['twosigma', 'Two Sigma', '<Logo Link>'],
    ['palantir-technologies', 'Palantir Technologies', '<Logo Link>'],
    ['affirm', 'Affirm', '<Logo Link>'],
    ['coupang', 'Coupang', '<Logo Link>'],
    ['hrt', 'Hudson River Trading', '<Logo Link>'],
    ['datadog', 'Datadog', '<Logo Link>'],
    ['qualtrics', 'Qualtrics', '<Logo Link>'],
    ['zillow', 'Zillow', '<Logo Link>'],
    ['robinhood', 'Robinhood', '<Logo Link>'],
    ['instacart', 'Instacart', '<Logo Link>'],
    ['cohesity', 'Cohesity', '<Logo Link>'],
    ['workday', 'Workday', '<Logo Link>'],
    ['swiggy', 'Swiggy', '<Logo Link>'],
    ['cognizant', 'Cognizant', '<Logo Link>'],
    ['akamai', 'Akamai', '<Logo Link>'],
    // Indian Startups
    ['zomato', 'Zomato', '<Logo Link>'],
    ['ola', 'Ola', '<Logo Link>'],
    ['byjus', 'Byju’s', '<Logo Link>'],
    ['flipkart', 'Flipkart', '<Logo Link>'],
    ['unacademy', 'Unacademy', '<Logo Link>'],
    ['freshworks', 'Freshworks', '<Logo Link>'],
    ['makemytrip', 'Zeta', '<Logo Link>'],
    ['titan', 'Titan', '<Logo Link>'],
    ['inmobi', 'InMobi', '<Logo Link>'],
    ['codenation', 'Codenation', '<Logo Link>'],
    ['directi', 'Directi', '<Logo Link>'],
  ]

export const company_tags = company_tags_unsorted.sort()

export const topic_tags = [
  ["array", "Array"],
  ["string", "String"],
  ["dynamic-programming", "Dynamic Programming"],
  ["math", "Math"],
  ["sorting", "Sorting"],
  ["greedy", "Greedy"],
  ["depth-first-search", "Depth-First Search"],
  ["binary-search", "Binary Search"],
  ["breadth-first-search", "Breadth-First Search"],
  ["tree", "Tree"],
  ["matrix", "Matrix"],
  ["two-pointers", "Two Pointers"],
  ["bit-manipulation", "Bit Manipulation"],
  ["binary-tree", "Binary Tree"],
  ["heap", "Heap (Priority Queue)"],
  ["stack", "Stack"],
  ["prefix-sum", "Prefix Sum"],
  ["graph", "Graph"],
  ["sliding-window", "Sliding Window"],
  ["backtracking", "Backtracking"],
  ["union-find", "Union Find"],
  ["linked-list", "Linked List"],
  ["ordered-set", "Ordered Set"],
  ["monotonic-stack", "Monotonic Stack"],
  ["trie", "Trie"],
  ["number-theory", "Number Theory"],
  ["divide-and-conquer", "Divide and Conquer"],
  ["recursion", "Recursion"],
  ["queue", "Queue"],
  ["bitmask", "Bitmask"],
  ["binary-search-tree", "Binary Search Tree"],
  ["segment-tree", "Segment Tree"],
  ["memoization", "Memoization"],
  ["binary-indexed-tree", "Binary Indexed Tree"],
  ["geometry", "Geometry"],
  ["topological-sort", "Topological Sort"],
  ["combinatorics", "Combinatorics"],
  ["game-theory", "Game Theory"],
  ["hashing", "Hashing"],
  ["shortest-path", "Shortest Path"],
  ["string-matching", "String Matching"],
  ["monotonic-queue", "Monotonic Queue"],
  ["merge-sort", "Merge Sort"],
  ["doubly-linked-list", "Doubly-Linked List"],
  ["probability-and-statistics", "Probability and Statistics"],
  ["suffix-array", "Suffix Array"],
  ["minimum-spanning-tree", "Minimum Spanning Tree"],
  ["strongly-connected-component", "Strongly Connected Component"],
  ["miscellaneous", "Miscellaneous"]
]