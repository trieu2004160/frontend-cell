const SimpleHomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header đơn giản */}
      <header className="bg-red-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">CellphoneS</h1>
          <p className="text-sm">Điện thoại, laptop, tablet chính hãng</p>
        </div>
      </header>

      {/* Content đơn giản */}
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            🔴 Trang đang trong chế độ test
          </h2>
          <p className="text-gray-600 mb-4">
            Trang web đang hoạt động bình thường. Nếu bạn thấy trang này, React
            đã render thành công.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-medium text-blue-800">📱 Điện thoại</h3>
              <p className="text-sm text-blue-600">
                Sản phẩm sẽ hiển thị ở đây
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-medium text-green-800">💻 Laptop</h3>
              <p className="text-sm text-green-600">
                Sản phẩm sẽ hiển thị ở đây
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <h3 className="font-medium text-purple-800">📟 Tablet</h3>
              <p className="text-sm text-purple-600">
                Sản phẩm sẽ hiển thị ở đây
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">⚠️ Thông báo</h3>
          <p className="text-sm text-yellow-700">
            Trang này đang chạy ở chế độ đơn giản. Để xem trang đầy đủ, hãy đảm
            bảo backend API đang chạy.
          </p>
        </div>
      </main>

      {/* Footer đơn giản */}
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p className="text-sm">© 2024 CellphoneS - Test Mode</p>
        </div>
      </footer>
    </div>
  );
};

export default SimpleHomePage;
