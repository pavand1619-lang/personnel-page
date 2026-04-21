let personnel = [


  {
    id: 3,
    fName: "dharani",
    lName: "gedela",
    empId: "15",
    email: "dharani@crop",
    phone: "-",
    dept: "",
    loc: "PUNE",
    sup: "-",
    status: "Active",
    address: "-"
  }
];

let currentId = 3; // dharani gedela active initially

// DOM Elements
const listContainer = document.getElementById("personnelList");
const btnAddTop = document.getElementById("btnAddTop");
const btnEdit = document.getElementById("btnEdit");

const modalOverlay = document.getElementById("modalOverlay");
const btnModalClose = document.getElementById("btnModalClose");
const btnModalCancel = document.getElementById("btnModalCancel");
const btnModalSave = document.getElementById("btnModalSave");
const form = document.getElementById("personnelForm");
const modalTitle = document.getElementById("modalTitle");

const profilePhotoInput = document.getElementById("profilePhotoInput");
const btnChoosePhoto = document.getElementById("btnChoosePhoto");
const photoFileName = document.getElementById("photoFileName");

function getInitials(fName, lName) {
  let initials = "";
  if (fName) initials += fName.charAt(0).toUpperCase();
  if (lName) initials += lName.charAt(0).toUpperCase();
  if (!initials) return "U";
  return initials;
}

function renderList() {
  listContainer.innerHTML = "";

  personnel.forEach(p => {
    const isActive = p.id === currentId;
    const div = document.createElement("div");
    div.className = `person-item ${isActive ? "active" : ""}`;
    div.onclick = () => selectPerson(p.id);

    const initials = getInitials(p.fName, p.lName);
    const fullName = `${p.fName} ${p.lName}`.trim();
    const dept = p.dept || "No Dept";

    div.innerHTML = `
      <div class="person-avatar">${initials}</div>
      <div class="person-info">
        <span class="person-name">${fullName}</span>
        <span class="person-dept">${dept}</span>
      </div>
    `;

    listContainer.appendChild(div);
  });
}

function selectPerson(id) {
  currentId = id;
  renderList();
  renderDetails();
}

function renderDetails() {
  const p = personnel.find(x => x.id === currentId);
  if (!p) return;

  const initials = getInitials(p.fName, p.lName);
  const fullName = `${p.fName} ${p.lName}`.trim();
  const dept = p.dept || "No Department";

  const fields = {
    detailAvatar: initials, detailName: fullName, detailDept: dept,
    infoFirstName: p.fName || "-", infoLastName: p.lName || "-", infoFullName: fullName || "-",
    infoEmpId: p.empId || "-", infoEmail: p.email || "-", infoPhone: p.phone || "-",
    infoDepartmentDesc: p.dept || "-", infoLocation: p.loc || "-", infoSupervisor: p.sup || "-",
    infoStatus: p.status || "Active", infoAddress: p.address || "-"
  };
  Object.keys(fields).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = fields[id];
  });

  renderEducation();
  renderJobHistory();
  renderExperience();
  renderTraining();
}

// Modal Logic
function openModal(mode = "add") {
  modalOverlay.classList.remove("hidden");

  if (mode === "add") {
    modalTitle.textContent = "Add New Personnel";
    document.getElementById("editId").value = "";
    form.reset();
    photoFileName.textContent = "No file chosen";
    profilePhotoInput.value = "";
  } else {
    modalTitle.textContent = "Edit Personnel";
    const p = personnel.find(x => x.id === currentId);
    if (p) {
      document.getElementById("editId").value = p.id;
      document.getElementById("fName").value = p.fName;
      document.getElementById("lName").value = p.lName;
      document.getElementById("eId").value = p.empId;
      document.getElementById("email").value = p.email;
      document.getElementById("dept").value = p.dept;
      document.getElementById("status").value = p.status;
      document.getElementById("loc").value = p.loc;
      document.getElementById("sup").value = p.sup;
    }
    photoFileName.textContent = "No file chosen";
    profilePhotoInput.value = "";
  }
}

function closeModal() {
  modalOverlay.classList.add("hidden");
  form.reset();
}

// Event Listeners
btnAddTop.addEventListener("click", () => openModal("add"));
btnEdit.addEventListener("click", () => openModal("edit"));

btnModalClose.addEventListener("click", closeModal);
btnModalCancel.addEventListener("click", closeModal);

btnChoosePhoto.addEventListener("click", () => {
  profilePhotoInput.click();
});

profilePhotoInput.addEventListener("change", (e) => {
  if (e.target.files && e.target.files.length > 0) {
    photoFileName.textContent = e.target.files[0].name;
  } else {
    photoFileName.textContent = "No file chosen";
  }
});

// Prevent closing on outside click or right click as requested
modalOverlay.addEventListener("click", (e) => {
  // Do nothing. Explicitly ignoring click outside to close.
});

modalOverlay.addEventListener("contextmenu", (e) => {
  e.preventDefault(); // Do not close on right click, and disable right click
});

btnModalSave.addEventListener("click", () => {
  if (!form.reportValidity()) return;

  const editId = document.getElementById("editId").value;

  const pData = {
    fName: document.getElementById("fName").value,
    lName: document.getElementById("lName").value,
    empId: document.getElementById("eId").value,
    email: document.getElementById("email").value,
    dept: document.getElementById("dept").value,
    status: document.getElementById("status").value,
    loc: document.getElementById("loc").value,
    sup: document.getElementById("sup").value,
    phone: "-",
    address: "-"
  };

  if (editId) {
    // Edit existing
    const index = personnel.findIndex(x => x.id == editId);
    if (index > -1) {
      personnel[index] = { ...personnel[index], ...pData };
      currentId = parseInt(editId);
    }
  } else {
    // Add new
    const newId = personnel.length ? Math.max(...personnel.map(x => x.id)) + 1 : 1;
    personnel.push({ id: newId, ...pData });
    currentId = newId; // Select the newly added
  }

  closeModal();
  renderList();
  renderDetails();
});

// Prevent form submission via enter key from reloading page
form.addEventListener("submit", (e) => {
  e.preventDefault();
  btnModalSave.click();
});

// Tabs Logic
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const tabContentTitle = document.getElementById("tabContentTitle");

// Create sliding indicator
const tabsContainer = document.querySelector(".tabs");
const indicator = document.createElement("div");
indicator.className = "tab-indicator";
if (tabsContainer) tabsContainer.appendChild(indicator);

function updateIndicator(btn) {
  if (indicator && btn) {
    indicator.style.width = `${btn.offsetWidth}px`;
    indicator.style.transform = `translateX(${btn.offsetLeft}px)`;
  }
}

tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    tabBtns.forEach(b => b.classList.remove("active"));
    tabContents.forEach(c => c.classList.add("hidden"));

    btn.classList.add("active");
    updateIndicator(btn);

    const tabId = btn.getAttribute("data-tab");
    document.getElementById("tab-" + tabId).classList.remove("hidden");

    if (tabId === 'personal') {
      tabContentTitle.textContent = "Personal Information";
    } else {
      tabContentTitle.textContent = btn.textContent;
    }
  });
});

// Initial load
const activeTab = document.querySelector(".tab-btn.active");
if (activeTab) {
  // Use timeout to ensure styles are painted so offsetWidth is correct
  setTimeout(() => updateIndicator(activeTab), 50);
}

// Sub-tabs Logic
const subTabBtns = document.querySelectorAll(".sub-tab-btn");
const subTabContents = document.querySelectorAll(".sub-tab-content");

subTabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    subTabBtns.forEach(b => b.classList.remove("active"));
    subTabContents.forEach(c => c.classList.add("hidden"));

    btn.classList.add("active");
    const subTabId = btn.getAttribute("data-subtab");
    document.getElementById("subtab-" + subTabId).classList.remove("hidden");
  });
});

// --- Data State Helper ---
function getActivePerson() {
  const p = personnel.find(x => x.id === currentId);
  if (p) {
    if (!p.education) p.education = [];
    if (!p.jobHistory) p.jobHistory = [];
    if (!p.experience) p.experience = [];
    if (!p.training) p.training = [];
  }
  return p;
}

function getFileName(inputId) {
  const input = document.getElementById(inputId);
  if (input && input.files && input.files.length > 0) return input.files[0].name;
  return "No file";
}

// --- Shared Table Renderer ---
function renderTable(data, tbodyId, emptyMsg, colCount, rowHTML) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${colCount}" class="empty-state">${emptyMsg}</td></tr>`;
  } else {
    tbody.innerHTML = data.map(rowHTML).join("");
  }
}

// --- Simplified Modal Helpers ---
const toggleModal = (modal, form, show) => {
  if (show && form) document.getElementById(form).reset();
  modal.classList[show ? 'remove' : 'add']("hidden");
};

// --- Education Mng ---
const educationModal = document.getElementById("educationModal");
const openEducationModal = () => toggleModal(educationModal, "educationForm", true);
const closeEducationModal = () => toggleModal(educationModal, null, false);

function renderEducation() {
  const p = getActivePerson();
  if (!p) return;
  renderTable(p.education, "eduTableBody", "No education records found.", 5, (edu, idx) => `
    <tr>
      <td>${edu.degree}</td><td>${edu.school}</td><td>${edu.year}</td>
      <td><a href="#" style="color: var(--primary);"><i class="ph ph-file-text"></i> ${edu.doc}</a></td>
      <td style="text-align: right;"><button class="icon-btn-small" onclick="deleteEducation(${idx})"><i class="ph ph-trash" style="color: #ef4444;"></i></button></td>
    </tr>`);
}

function saveEducation() {
  const degree = document.getElementById("eduDegree").value.trim();
  const school = document.getElementById("eduSchool").value.trim();
  const year = document.getElementById("eduYear").value.trim();

  if (!degree || !school || !year) {
    alert("Please fill all required fields (*).");
    return;
  }

  const p = getActivePerson();
  p.education.push({ degree, school, year, doc: getFileName("eduDocument") });
  renderEducation();
  closeEducationModal();
}

function deleteEducation(idx) {
  const p = getActivePerson();
  p.education.splice(idx, 1);
  renderEducation();
}

// --- Job History Mng ---
const jobHistoryModal = document.getElementById("jobHistoryModal");
const jhCurrentEmp = document.getElementById("jhCurrentEmp");
const jhEndDate = document.getElementById("jhEndDate");

function openJobHistoryModal() {
  toggleModal(jobHistoryModal, "jobHistoryForm", true);
  jhEndDate.disabled = false; jhEndDate.style.opacity = "1";
}
const closeJobHistoryModal = () => toggleModal(jobHistoryModal, null, false);

if (jhCurrentEmp) {
  jhCurrentEmp.addEventListener("change", (e) => {
    if (e.target.checked) {
      jhEndDate.value = "Present";
      jhEndDate.disabled = true;
      jhEndDate.style.opacity = "0.5";
    } else {
      jhEndDate.value = "";
      jhEndDate.disabled = false;
      jhEndDate.style.opacity = "1";
    }
  });
}

function renderJobHistory() {
  const p = getActivePerson();
  if (!p) return;
  renderTable(p.jobHistory, "jhTableBody", "No job history found.", 5, (jh, idx) => `
    <tr>
      <td>${jh.company}</td><td>${jh.position}</td><td>${jh.fromDate} - ${jh.endDate}</td>
      <td><a href="#" style="color: var(--primary);"><i class="ph ph-file-text"></i> ${jh.doc}</a></td>
      <td style="text-align: right;"><button class="icon-btn-small" onclick="deleteJobHistory(${idx})"><i class="ph ph-trash" style="color: #ef4444;"></i></button></td>
    </tr>`);
}

function saveJobHistory() {
  const company = document.getElementById("jhCompany").value.trim();
  const position = document.getElementById("jhPosition").value.trim();
  const fromDate = document.getElementById("jhFromDate").value.trim();
  let endDate = document.getElementById("jhEndDate").value.trim();

  if (jhCurrentEmp && jhCurrentEmp.checked) endDate = "Present";

  if (!company || !position || !fromDate || !endDate) {
    alert("Please fill all required fields (*).");
    return;
  }

  const p = getActivePerson();
  p.jobHistory.push({ company, position, fromDate, endDate, doc: getFileName("jhDocument") });
  renderJobHistory();
  closeJobHistoryModal();
}

function deleteJobHistory(idx) {
  const p = getActivePerson();
  p.jobHistory.splice(idx, 1);
  renderJobHistory();
}

// --- Experience Mng ---
const experienceModal = document.getElementById("experienceModal");
const openExperienceModal = () => toggleModal(experienceModal, "experienceForm", true);
const closeExperienceModal = () => toggleModal(experienceModal, null, false);

function renderExperience() {
  const p = getActivePerson();
  if (!p) return;
  renderTable(p.experience, "expTableBody", "No experience records found.", 3, (exp, idx) => `
    <tr>
      <td><strong>${exp.method}</strong></td><td>${exp.hours} hrs</td>
      <td style="text-align: right;"><button class="icon-btn-small" onclick="deleteExperience(${idx})"><i class="ph ph-trash" style="color: #ef4444;"></i></button></td>
    </tr>`);
}

function saveExperience() {
  const method = document.getElementById("expMethod").value.trim();
  const hours = document.getElementById("expHours").value.trim();

  if (!method || !hours) {
    alert("Please fill all required fields (*).");
    return;
  }

  const p = getActivePerson();
  p.experience.push({ method, hours });
  renderExperience();
  closeExperienceModal();
}

function deleteExperience(idx) {
  const p = getActivePerson();
  p.experience.splice(idx, 1);
  renderExperience();
}

// --- Training Mng ---
const trainingModal = document.getElementById("trainingModal");
const openTrainingModal = () => toggleModal(trainingModal, "trainingForm", true);
const closeTrainingModal = () => toggleModal(trainingModal, null, false);

function renderTraining() {
  // Can be extended to render training records to the Training Records tab body later!
  console.log("Render Training called.");
}

function saveTraining() {
  // Can be extended to grab from fields, push to p.training, and renderTraining().
  closeTrainingModal();
}

// Initialization
renderList();
renderDetails();
