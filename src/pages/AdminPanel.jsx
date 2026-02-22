function AdminPanel() {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Admin Panel</h2>

            <div className="bg-white p-6 rounded-xl shadow">
                <p>Submission #123 - Plastic - 5kg</p>
                <button className="bg-green-700 text-white px-4 py-2 rounded mr-2">
                    Approve
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded">
                    Reject
                </button>
            </div>
        </div>
    )
}

export default AdminPanel