export const createSelectElement = (
  labelText: string,
  devices: MediaDeviceInfo[],
  container: HTMLElement,
  onChange: (event: Event) => void
) => {
  const label = document.createElement("label");
  label.textContent = labelText;
  label.classList.add("label");

  const select = document.createElement("select");
  select.classList.add("select");

  devices.forEach((device) => {
    const option = document.createElement("option");
    option.value = device.deviceId;
    option.textContent =
      device.label || `${labelText} ${devices.indexOf(device) + 1}`;
    select.appendChild(option);
  });

  select.addEventListener("change", onChange);

  container.appendChild(label);
  container.appendChild(select);
};
