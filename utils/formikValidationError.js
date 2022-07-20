export default function formikValidationError(err) {
  try {
    return err.reduce((acc, val) => ({...acc, [val.path.join(".")]: val.message }), {});
  } catch(err) {
    console.error("An error occurred while parsing formik validation error:", err);
    return {};
  }
}