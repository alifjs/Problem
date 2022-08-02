import './App.css';

function App() {
  return (
    <div>
      <form action="http://localhost:3005/uploadfile" encType="multipart/form-data" method="post">
        <input type="file" name="uploadfile" accept='csv' />
        <input type="submit" value="Upload CSV"/>
      </form>
    </div>
  );
}

export default App;
