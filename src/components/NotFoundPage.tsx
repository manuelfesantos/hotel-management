import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl mb-4">404 - Page Not Found</h1>
      <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
        Return to Hotel Overview
      </Link>
    </div>
  );
};
