# NextJS template with JWT and Refresh Token Auth

## Introduction

This template is a tailormade template for NextJS with JWT and Refresh Token Auth.
It also contains extended utility functions for NextJS to make it easier to use.
It introduces better API endpoint handler, custom endpoint middleware, HTTP agent for both server side and client side use, and more.

## Setup

```
  npx create-react-app -e https://github.com/tradeio/nextjs_auth_template my-app
  cd my-app
  npm install
  npm run dev
```

**IMPORTANT**: create a `.env.local` file before running!

## ENV file

There are two files `config/enums.js` and `config/client_enums.js` that contain constants and env variables
that are used in the application. The `enums.js` file is used by the server and the `client_enums.js` file is used by the client.
Create a `.env.local` file and include all the variables exported from `process.env` inside both files.

Notice the env variables for the client are prefixed with `NEXT_PUBLIC_` this is important and is a standard used by **Next.js**.
Therefore your `.env.local` should look something like this:
(Refrain from using any spaces and for multiline variables encapsulate them in quotes)

```
MONGO_DB_CONNECTION_URI=examplemongodbconnection
JWT_SECRET=exampleSecret
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000/api
```

# Authorization:

The authorization system works using **JsonWebToken (JWT)** and **RefreshToken (rToken)**. This is a standard practicse and it works in the following way:

Once a user is loggedIn, it is given a JWT and an rToken. Both tokens are stored in cookies but only the JWT is used in requests,
inside the `Authorization: Bearer <jwt>` header. The server will verify the JWT and use it to get the user data it needs.
The JWT has a very small expiration time usually 5-10 minutes this is intentional since the JWT is not meant to be used for long term authentication. At that point the rToken is used to get a new JWT.

This process needs to occur automatically every time a JWT token expires. There are two methods for this:

- either you check the expiration date of the JWT and set up a timer to refresh the JWT every time before it expires
- or you wait until the server responds with Invalid JWT token and try to refresh the JWT at that point

(We use the 2nd method)

# Server:

## Endpoint Handler

The normal endpoints in Next are created inside the "api" folder and accept all request methods
`[GET, POST, PUT, PATCH, ...]`. You can check the method using `(req.method === "GET")` but this would introduce
a lot of overhead in your code. This quickly builds up your code-base, messing up your code and introduces a need for a better solution.
The endpoint handler separates those functions into its appropriate counterparts using an object.

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
middleware functionality at every stage of the handler code.
A middleware is simply a function that runs before your original GET, POST etc.. functionality.

### params:

- `req`: `NextApiRequest`
- `res`: `NextApiResponse`
- `next`: `function` this can be called (`next()`) with no parameters to continue to the next middleware (or endpoint) or
  (`next(errorBody, statusCode)`) to stop the request and return an error with statusCode and errorBody as the response.

**NOTE**: The `next` function needs to be called only once in the middleware!

### Example endpoint middleware:

```javascript
function exampleMiddleware(req, res, next) {
  if (req.headers.authorization) {
    req.user = "Example user";
    next();
  } else {
    next({ message: "Unauthorized" }, 401);
  }
}

function GET(req, res) {
  let user = req.user; // The key user exists only because exampleMiddleware was run!
  res.status(200).json({ message: "Example GET", user });
}

function POST(req, res) {
  let user = req.user; // The key user exists only because exampleMiddleware was run!
  res.status(200).json({ message: "Example POST", user });
}

export default endpointHandler(exampleMiddleware, {
  // example middleware is run before all methods
  GET,
  POST,
});
```

### Example method middleware:

```javascript
function exampleMiddleware(req, res, next) {
  if (req.headers.authorization) {
    req.user = "Example user";
    next();
  } else {
    next({ message: "Unauthorized" }, 401);
  }
}

function GET(req, res) {
  let user = req.user; // The key user DOES NOT exists here!
  res.status(200).json({ message: "Example GET", user });
}

function POST(req, res) {
  let user = req.user; // The key user exists only because exampleMiddleware was run!
  res.status(200).json({ message: "Example POST", user });
}

export default endpointHandler({
  GET,
  POST: [exampleMddleware, POST], // middleware is run only for POST method!
});
```

## Authentication Middleware

We have a custom middleware already build in that handles authentication of JWT located in `backend/middleware/auth.middleware.js`
The middleware will check for a headers `Authorization: Bearer <jwt>` and if it is found it will check if the JWT is valid.
If the JWT is valid it will proceed to the next middleware/endpoint.
If the JWT is invalid it will return a 401 HTTP responsode with a body containing the `code: "INVALID_JWT"`. We use this to identify wether an HTTP request has failed due to invalid token or due to other reasons. (It is used in the HTTP agent interceptor mentioned in the client section below).

## HTTPError

There is a custom error class provided called `HTTPError` that is recognized by the endpoint handler and knows how to respond to the user
with the correct body and status code. Located in `backend/utils/HTTPError.js` use it inside your code like this: `throw new HTTPError(responseBody, statuscode)`.

## CORS

Cors is a standard that allows cross-origin resource sharing. The config found in
`next.config.js` is used to configure the CORS policy. BUT there is one extra issue for
preflight requests which is handled by the endpointHandler too (basically if the request is of type OPTIONS
it will be send the 200 status always before any middleware or anything just to make sure its working!).

If you want to have more control over cors change the headers from the default ones below.

```javascript
const nextConfig = {
  headers: [
    {
      source: "/api/(.*)",
      headers: [
        { key: "Access-Control-Allow-Credentials", value: "true" },
        { key: "Access-Control-Allow-Origin", value: "*" }, // Change this to specific domain for better security
        {
          key: "Access-Control-Allow-Methods",
          value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
        },
        {
          key: "Access-Control-Allow-Headers",
          value:
            "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
        },
      ],
    },
  ],
};
```

# Client:

Client side HTTP requests have some extra complexity with NextJS due to the fact that it is a SSR (Server Side Rendering) application.
Therefore we send HTTP requests either from client side (javascript in the browser) or from the server side (`getServerSideProps()`).

**Note**: `getStaticProps()` is different it is used without users credentials therefore the following does not apply for it!

The file `utils/agent.js` is a custom HTTP agent that is setup and ready to use with all the available functionality to refresh and use the JWT and rTokens. Extend the agent with any new functionality you want to add there using the `axiosInstance` variable.

Import the agent and use it either in your components/pages or in the getServerSideProps() function.

There are two example pages located in `pages/clientsidefetch.js` and `pages/serversidefetch.js`:

### Example getServerSideProps:

```javascript
  function getServerSideProps(context) {
    let data = {};
    let error = null;
    try {
      // import agent and pass serverSide context into it
      data = await agent(context).example().then((res) => res.data);
    } catch (err) {
      if ([401, 403].includes(err?.response?.status)) {
        // if request failed due to invalid tokens redirect user to login page
        // A set cookie header will be created that will instruct the client to delete the cookies for jwt and rToken
        return {
          redirect: {
            permanent: false,
            destination: context.resolvedUrl
              ? `/login?from=${context.resolvedUrl}`
              : "/login",
          },
        };
      }
      // otherwise the request failed for other reasons so return the error to the client props;
      error = err?.response?.data;
    }
    return {
      props: { data, error },
    };
  }
```

### Example in components:

```jsx
export default function ClientSideFetch() {
  const [query, setQuery] = useState({
    isLoading: true,
    data: null,
    err: null,
  });
  useEffect(() => {
    agent() // agent called without any arguments is used in clientside fetch
      .example()
      .then((res) => {
        setQuery({ isLoading: false, data: res.data, err: null });
      })
      .catch((err) => {
        setQuery({ isLoading: false, data: null, err });
      });
  }, []);

  return (
    <div>
      {query.isLoading ? <div>Loading...</div> : <div>{query.data}</div>}
    </div>
  );
}
```

## Pages:

There are some existing pages like `pages/login.js`, `pages/register.js` and `pages/index.js` that you can use as starting point.
They have some important concepts in them.

### Login page:

This page needs to be set in a loading state from the beginning and have a `useEffect()` that will attempt to refresh the JWT token. This is to detect wether a user has an rToken stored in localStorage and if it is valid it will redirect the user to the index page. (Or if the url contains a `from=/example` query parameter it will redirect the user to the page specified).

Other than that its just a normal login form that on submit will attempt to login the user.
**NOTE**: the login method of agent() will set the localStorage rToken value and cookies for both JWT and rToken.

### Register page:

Simple page that just has a form that on submit will attempt to register the user. On success the user is automatically logged in!
**NOTE**: the register method of agent() will set the localStorage rToken value and cookies for both JWT and rToken.

### Formik:

If you want to use formik library there is a helper function that converts validation errors from the server into correct formik errors.
`utils/formikValidationError.js`

The following code is the onSubmit function of the `<Formik>` component

```jsx
<Formik
  onSubmit={async (values, { setErrors, setStatus }) => {
    setStatus();
    try {
      await agent().login(values.email, values.password).then(onSuccess);
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.details
      ) {
        let formikErrors = formikValidationError(err.response.data.details);
        setErrors(formikErrors);
      } else {
        setStatus(err?.response?.data?.message);
      }
    }
  }}
>
  {() => <p>EXAMPLE</p>}
</Formik>
```

## Page Middleware:

There is a typescript file in the root of the project `middleware.ts` that contains middleware functionality for all the project (api, pages, images etc...) this is NextJS own middleware support. In order to run diffent middleware base on paths there are some lists in the beginning of the file.

- `authenticationPages`: pages that allow the user to be authenticated (login, register) these pages will not be available if a user is logged in!(To force the user to use the logout function -> very important for security!)
- `privatePagesWhitelist`: pages that can only be accessible by a logged in user (more accuratly if a user has JWT and rToken in cookies). These pages will not be available if a user is not logged in!
