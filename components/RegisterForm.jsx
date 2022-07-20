import { Field, Form, Formik, ErrorMessage } from "formik";
import React from "react";
import * as Yup from "yup";
import agent from "../utils/agent";
import formikValidationError from "../utils/formikValidationError";

export default function RegisterForm({ onSuccess }) {
  return (
    <Formik
      validationSchema={Yup.object().shape({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
        cpassword: Yup.string()
          .oneOf([Yup.ref("password")], "Passwords must match")
          .required(),
      })}
      initialValues={{ email: "", password: "", cpassword: "" }}
      onSubmit={async (values, {setErrors, setStatus}) => {
        setStatus();
        try {
          await agent().register(values.email, values.password).then(onSuccess);
        } catch (err) {
          if(err.response && err.response.status === 400 &&  err.response.data.details) {
            let formikErrors = formikValidationError( err.response.data.details);
            setErrors(formikErrors);
          } else {
            setStatus(err?.response?.data?.message);
          }
        }
      }}
    >
      {({ status }) => (
        <Form>
          <Field type="email" name="email" placeholder="Email" />
          <ErrorMessage name="email" component="div" className="error" />
          <br />
          <Field type="password" name="password" placeholder="Password" />
          <ErrorMessage name="password" component="div" className="error" />
          <br />
          <Field
            type="password"
            name="cpassword"
            placeholder="Confirm Password"
          />
          <ErrorMessage name="cpassword" component="div" className="error" />
          <br />
          <button type="submit">Register</button>
          <div className="error">{status}</div>
        </Form>
      )}
    </Formik>
  );
}
