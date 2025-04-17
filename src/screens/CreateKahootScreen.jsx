import React from 'react';
const CreateKahoot = () => {
    const input = {
        border: "1px solid",
        width: "300px",
        height: "30px",
        margin: "10px",
        padding: "5px",
        borderRadius: "5px",


    };

    return (
        <div className="create-kahoot-screen" style={{ padding: "20px", textAlign: "center", display: "flex", justifyContent: 'center', flexDirection: "column", alignItems: "center", }}>
            <h1>Create Kahoot</h1>
            <form>
                <input style={input} type="text" placeholder="Kahoot Title" required />
                <textarea placeholder="Description" required style={{ width: "300px", height: "100px", textAlign: 'left', paddingTop: '10px', paddingLeft: '5px' }}></textarea>

                <button type="submit">Create Kahoot</button>
            </form>
        </div>
    );
};
export default CreateKahoot;