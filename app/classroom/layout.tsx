import Footer from "@/components/footer";
import { Navbar } from "../(dashboard)/_components/sidebar/navbar";
import { Sidebar } from "../(dashboard)/_components/sidebar/sidebar";

const ClassroomLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-full bg-white">
      <div className="h-[70px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">
        <div className="min-h-full ">
          {children}
        </div>
        <footer>
          <Footer />
        </footer>
      </main>

    </div>
  );
}

export default ClassroomLayout;