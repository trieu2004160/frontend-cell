// import React from "react";

// interface ErrorBoundaryState {
//   hasError: boolean;
//   error?: Error;
// }

// class ErrorBoundary extends React.Component<
//   React.PropsWithChildren<{}>,
//   ErrorBoundaryState
// > {
//   constructor(props: React.PropsWithChildren<{}>) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error: Error): ErrorBoundaryState {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     console.error("ErrorBoundary caught an error:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="p-8 bg-red-50 min-h-screen">
//           <h1 className="text-2xl font-bold text-red-600 mb-4">
//             Something went wrong!
//           </h1>
//           <details className="bg-white p-4 rounded border">
//             <summary className="cursor-pointer font-medium mb-2">
//               Error Details
//             </summary>
//             <pre className="text-sm text-gray-700 whitespace-pre-wrap">
//               {this.state.error?.message}
//               {"\n\n"}
//               {this.state.error?.stack}
//             </pre>
//           </details>
//           <button
//             onClick={() => this.setState({ hasError: false })}
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Try again
//           </button>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// export default ErrorBoundary;
