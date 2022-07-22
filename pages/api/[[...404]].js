export default function errorHandler(req, res) {
  res.status(404).json({ message: "API endpoint not found" });
}