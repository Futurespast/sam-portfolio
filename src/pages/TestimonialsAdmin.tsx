import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import "./Responsive.css";

interface Testimonial {
  id: number;
  approved: boolean;
  name: string;
  content: string;
}

const TestimonialsAdmin: React.FC = () => {
  const [approvedTestimonials, setApprovedTestimonials] = useState<Testimonial[]>([]);
  const [pendingTestimonials, setPendingTestimonials] = useState<Testimonial[]>([]);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);

  const fetchTestimonials = async () => {
    const { data } = await supabase.from("testimonials").select("*");
    const testimonials: Testimonial[] = data ?? [];
    setApprovedTestimonials(testimonials.filter((t) => t.approved));
    setPendingTestimonials(testimonials.filter((t) => !t.approved));
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const approveTestimonial = async (id: number) => {
    await supabase.from("testimonials").update({ approved: true }).eq("id", id);
    fetchTestimonials();
  };

  const deleteTestimonial = async (id: number) => {
    await supabase.from("testimonials").delete().eq("id", id);
    fetchTestimonials();
  };

  const confirmDeleteTestimonial = async () => {
    if (!testimonialToDelete) return;
    await deleteTestimonial(testimonialToDelete.id);
    setTestimonialToDelete(null);
  };

  const cancelDelete = () => setTestimonialToDelete(null);

  return (
    <div className="testimonials-admin-container">
      <h2>Pending Testimonials</h2>
      {pendingTestimonials.map((test) => (
        <div className="testimonials-admin-card" key={test.id}>
          <p>
            <strong>Name:</strong> {test.name}
          </p>
          <p>
            <strong>Content:</strong> {test.content}
          </p>
          <div className="testimonials-admin-actions">
            <button onClick={() => approveTestimonial(test.id)}>Approve</button>
            <button onClick={() => setTestimonialToDelete(test)}>Delete</button>
          </div>
        </div>
      ))}

      <h2>Approved Testimonials</h2>
      {approvedTestimonials.map((test) => (
        <div className="testimonials-admin-card" key={test.id}>
          <p>
            <strong>Name:</strong> {test.name}
          </p>
          <p>
            <strong>Content:</strong> {test.content}
          </p>
          <div className="testimonials-admin-actions">
            <button onClick={() => setTestimonialToDelete(test)}>Delete</button>
          </div>
        </div>
      ))}

      {testimonialToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this testimonial?</p>
            <div className="modal-buttons">
              <button className="modal-confirm" onClick={confirmDeleteTestimonial}>
                Confirm
              </button>
              <button className="modal-cancel" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsAdmin;
