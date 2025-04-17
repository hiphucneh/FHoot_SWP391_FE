import React from 'react';
const CreateKahoot = () => {


    return (
        <div className="create-kahoot-screen">
            <h1>Create Kahoot</h1>
            <form>
                <input type="text" placeholder="Kahoot Title" required />
                <textarea placeholder="Description" required></textarea>
                <button type="submit">Create Kahoot</button>
            </form>
        </div>
    );
}
export default CreateKahoot;