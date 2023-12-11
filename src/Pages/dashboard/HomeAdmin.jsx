import TableUser from "../../Composants/TableUser";

export default function HomeAdmin() {

return (
    <>
      <main className='main-container p-0 text-dark'>
            <h3 className='p-4'>Liste des utilisateurs</h3>
            <TableUser/>
      </main>
    </>
    )
}