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

export const alertContainerHtml = `
  <div class="alert-content">
    <div class="icon-container">
      <svg class="icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="text-content">
      <p class="alert-text">Waiting for your partner...</p>
    </div>
  </div>
`;

export const alertContainerCss = `
  .alert-container {
    background-color: #ebf8ff;
    border-radius: 15px; /* Match the video's rounded corners */
    padding: 1rem;
    margin-top: 5px; /* Add some space between the video and the alert */
    box-sizing: border-box; /* Ensure padding is included in the width */
    animation: pulsate 1.5s infinite; /* Add pulsating animation */
  }

  .alert-content {
    display: flex;
    align-items: center; /* Center items vertically */
  }

  .icon-container {
    flex-shrink: 0;
  }

  .icon {
    height: 1.25rem;
    width: 1.25rem;
    color: #63b3ed;
  }

  .text-content {
    margin-left: 0.75rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center; /* Center text vertically */
  }

  .alert-text {
    font-size: 1.5rem;
    color: #2b6cb0;
  }

  .alert-link-container {
    margin-top: 0.75rem;
    font-size: 1.5rem;
    color: #2b6cb0;
  }

  .alert-link {
    font-weight: 500;
    color: #2b6cb0;
    text-decoration: none;
  }

  .alert-link:hover {
    color: #2c5282;
  }

  @media (min-width: 768px) {
    .alert-link-container {
      margin-top: 0;
      margin-left: 1.5rem;
    }
  }

  @keyframes pulsate {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.7;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;
