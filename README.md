# NextJS template with JWT and Refresh Token Auth
## Setup
```
  npx create-react-app -e https://github.com/tradeio/nextjs_auth_template my-app
  cd my-app
  npm install
  npm run dev
```

**IMPORTANT**: create a `.env.local` file before running!

## Endpoint Handler
The normal endpoints in Next are created inside the "api" folder and accept all request methods
`[GET, POST, PUT, PATCH, ...]`. You can check the method using `(req.method === "GET")` but this would introduce
a lot of if blocks in your code. This quickly builds up your code-base, messing up your code and introduces a need for a better solution.
The endpoint handler removes the need to use if statements and separates the code using an object.

### Example:
```javascript
  // ------ ENDPOINT HANDLER ------ //
  function GET(req, res) {
    res.status(200).json({ message: "Example" })
  }

  export default endpointHandler({
    GET
  }) 

  // ------ VS Default Nextjs ------ //
  export default function handler(req, res) {
    if(req.method === "GET") {
      res.status(200).json({ message: "Example" })
    } else {
      res.status(405).json({ message: "Unsupported method type" })
    }
  }
```

## Middleware
NextJS has very limited middleware options. The endpoint handler introduces a
middleware functionality at every stage of your code. 
