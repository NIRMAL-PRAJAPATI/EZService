import ComplaintForm from "../components/Complaint/Complaint-Form";
import PageHeader from "../components/ui/PageHeader";

export default function Complaint() {
  return (
    <div className="pb-10">
      <PageHeader title="Help & complaints" subtitle="Report a problem with a booking" />
      <div className="max-w-2xl mx-auto px-4 pt-5">
        <ComplaintForm />
      </div>
    </div>
  );
}
