export const choosePlatformComponentStyles = `
  .label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.5;
    color: #1f2937;
    text-align: center;
  }
  .select {
    margin-top: 0.5rem;
    display: block;
    width: 100%;
    border-radius: 0.375rem;
    border: none;
    padding-top: 0.375rem;
    padding-bottom: 0.375rem;
    padding-left: 0.75rem;
    padding-right: 2.5rem;
    color: #1f2937;
    box-shadow: inset 0 0 0 1px #d1d5db;
  }
  .select:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: inset 0 0 0 1px #6366f1, 0 0 0 2px #6366f1;
  }
  .select.sm {
    font-size: 0.875rem;
    line-height: 1.5;
  }
  .custom-button {
    border-radius: 0.375rem; /* rounded-md */
    background-color: #4f46e5; /* bg-indigo-600 */
    padding-left: 0.75rem; /* px-3 */
    padding-right: 0.75rem; /* px-3 */
    padding-top: 0.5rem; /* py-2 */
    padding-bottom: 0.5rem; /* py-2 */
    font-size: 0.875rem; /* text-sm */
    font-weight: 600; /* font-semibold */
    color: #ffffff; /* text-white */
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
    transition: background-color 0.3s; /* For smooth hover transition */
    margin-top: 10px; /* Add some spacing between the select and button */
  }
  .custom-button:hover {
    background-color: #4338ca; /* hover:bg-indigo-500 */
  }
  .custom-button:focus-visible {
    outline: 2px solid #4f46e5; /* focus-visible:outline-indigo-600 */
    outline-offset: 2px; /* focus-visible:outline-offset-2 */
  }
  `;
