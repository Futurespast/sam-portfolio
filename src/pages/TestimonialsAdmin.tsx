import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const TestimonialsAdmin = () => {
  const [approvedTestimonials, setApprovedTestimonials] = useState([]);
  const [pendingTestimonials, setPendingTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase.from("testimonials").select("*");
      setApprovedTestimonials(data.filter((t) => t.approved) || []);
      setPendingTestimonials(data.filter((t) => !t.approved) || []);
    };
    fetchTestimonials();
  }, []);

  const approveTestimonial = async (id) => {
    await supabase.from("testimonials").update({ approved: true }).eq("id", id);
    setApprovedTestimonials([...approvedTestimonials, pendingTestimonials.find((t) => t.id === id)]);
    setPendingTestimonials(pendingTestimonials.filter((t) => t.id !== id));
  };

  const deleteTestimonial = async (id: number, isApproved: boolean) => {
    await supabase.from("testimonials").delete().eq("id", id);
    if (isApproved) {
      setApprovedTestimonials((prev) => prev.filter((test) => test.id !== id));
    } else {
      setPendingTestimonials((prev) => prev.filter((test) => test.id !== id));
    }
  };

  return (
    <div>
      <h2>Pending Testimonials</h2>
      {pendingTestimonials.map((test) => (
        <div style={styles.div} key={test.id}>
          <p>Name: {test.name}</p>
          <p>Content: {test.content}</p>
          <button onClick={() => approveTestimonial(test.id)}>Approve</button>
          <button onClick={() => deleteTestimonial(test.id, false)}>Delete</button>
        </div>
      ))}

      <h2>Approved Testimonials</h2>
      {approvedTestimonials.map((test) => (
        <div style={styles.div} key={test.id}>
          <p>Name: {test.name}</p>
          <p>Content: {test.content}</p>
          <button onClick={() => deleteTestimonial(test.id, true)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default TestimonialsAdmin;
const styles = {
  div: {
    backgroundColor: "gray",
  }
}