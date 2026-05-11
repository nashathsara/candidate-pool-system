import { useNavigate } from "react-router-dom";
import CandidatePublicLayout from "../../layouts/CandidatePublicLayout";
import { CandidateForm } from "../../components/candidate/CandidateForm/CandidateForm";
import { useCandidates } from "../../hooks/useCandidates";
import type { CandidateRecord } from "../../utils/candidateTypes";

const ProfileCreate = () => {
  const { addCandidate } = useCandidates();
  const navigate = useNavigate();

  const handleCreate = (draft: Omit<CandidateRecord, "id">) => {
    const id = addCandidate(draft);
    navigate(`/candidates/${id}`, { replace: false });
  };

  return (
    <CandidatePublicLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your profile</h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Add your details to join the talent pool. After you submit, admins can review
          your profile from the Candidates workspace.
        </p>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-2xl">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Profile details</h2>
          <CandidateForm
            onSubmit={handleCreate}
            submitLabel="Create profile & preview admin view"
          />
        </div>
      </div>
    </CandidatePublicLayout>
  );
};

export default ProfileCreate;
