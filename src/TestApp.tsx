const TestApp = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Test App - React đang hoạt động!</h1>
      <p>Nếu bạn thấy text này, React đã load thành công.</p>
      <button onClick={() => alert("Button hoạt động!")}>Test Button</button>
    </div>
  );
};

export default TestApp;
