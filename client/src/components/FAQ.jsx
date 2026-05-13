import { useState } from "react";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Is SecureChat really decentralized?",
      answer: "Yes, SecureChat leverages blockchain-based identity and peer-to-peer message routing to ensure no single entity controls your data."
    },
    {
      question: "How is my data encrypted?",
      answer: "Every message is encrypted on your device using AES-256 before being sent. Only the intended recipient with the correct key can decrypt it."
    },
    {
      question: "Do I need a crypto wallet?",
      answer: "Yes, a Web3 wallet (like MetaMask) is used for secure authentication without requiring traditional passwords or email addresses."
    }
  ];

  return (
    <div className="faq-section">
      <h2 className="section-title">Frequently Asked Questions</h2>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
          >
            <div className="faq-question">
              <span>{faq.question}</span>
              <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
