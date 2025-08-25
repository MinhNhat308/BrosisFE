import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Student {
  id: number;
  student_id: string;
  name: string;
  email: string;
  phone?: string;
  parent_name?: string;
  parent_phone?: string;
  department: string;
  contact_status: string;
  insurance_status: string;
  address?: string;
  notes?: string;
  avatar_url?: string;
  status: string;
  created_at: string;
  event_participations?: any[];
  document_submissions?: any[];
}

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentDetailModal({ student, isOpen, onClose }: StudentDetailModalProps) {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{student.name}</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p>Email: {student.email}</p>
          <p>Department: {student.department}</p>
          <p>Student ID: {student.student_id}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
