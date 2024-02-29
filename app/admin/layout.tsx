import Footer from "@/components/footer";
import AdminNavbar from "./admin-navbar";

const AdminLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-full bg-white">
      <AdminNavbar/>
        <div className="min-h-full ">
          {children}
        </div>
        <footer>
          <Footer />
        </footer>
    </div>
  );
}

export default AdminLayout;