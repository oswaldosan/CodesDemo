const WhiteContainer = ({ children }) => {
    return (
        <div className="py-12 px-7">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default WhiteContainer;
