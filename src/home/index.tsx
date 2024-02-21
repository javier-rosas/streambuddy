export default function Home() {
  const logout = () => {
    console.log("logout");
  };

  return (
    <div className="bg-red-700">
      <button onClick={() => logout()} type="button">
        Sign out
      </button>
    </div>
  );
}
