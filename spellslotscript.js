// Global variables for spell slots
let currentView = 'spellList';
let spellSlots = {};

// Function to switch between views
function switchView(view) {
    currentView = view;
    const spellListContainer = document.getElementById('spellContainer');
    const spellSlotsContainer = document.getElementById('spellSlotsContainer');
    
    if (view === 'spellList') {
        spellListContainer.classList.remove('hidden');
        spellSlotsContainer.classList.add('hidden');
    } else {
        spellListContainer.classList.add('hidden');
        spellSlotsContainer.classList.remove('hidden');
        renderSpellSlots();
    }
}

// Function to render spell slots based on selected level
function renderSpellSlots() {
    const container = document.getElementById('spellSlotsContainer');
    const maxLevel = parseInt(document.getElementById('maxLevelSelect').value, 10);
    const selectedClass = document.getElementById('classSelect').value;
    
    if (selectedClass === 'All') {
        container.innerHTML = '<div class="text-center py-4">Please select a class to view spell slots.</div>';
        return;
    }
    
    container.innerHTML = '';
    
    // Create slots for each level up to maxLevel
    for (let level = 0; level <= maxLevel; level++) {
        const levelContainer = document.createElement('div');
        levelContainer.className = 'mb-6';
        
        // Header for each level
        const header = document.createElement('h3');
        header.className = 'text-lg font-semibold mb-2';
        header.textContent = level === 0 ? 'Cantrips' : `Level ${level}`;
        levelContainer.appendChild(header);
        
        // Grid for spell slots
        const slotsGrid = document.createElement('div');
        slotsGrid.className = 'grid grid-cols-4 gap-2';
        
        // Number of slots based on level (you can adjust this based on PF2e rules)
        const numSlots = level === 0 ? 5 : 3; // Example: 5 cantrip slots, 3 slots for other levels
        
        for (let slot = 0; slot < numSlots; slot++) {
            const slotId = `slot-${level}-${slot}`;
            const slotData = spellSlots[slotId];
            
            const slotButton = document.createElement('button');
            slotButton.className = `p-2 border rounded ${slotData ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-100'}`;
            slotButton.innerHTML = slotData 
                ? `<div class="text-sm font-medium">${slotData.name}</div>`
                : '<div class="text-sm text-gray-500">Empty Slot</div>';
            
            slotButton.onclick = () => openSlotModal(level, slot);
            slotsGrid.appendChild(slotButton);
        }
        
        levelContainer.appendChild(slotsGrid);
        container.appendChild(levelContainer);
    }
}

// Function to open the slot selection modal
function openSlotModal(level, slotIndex) {
    const slotId = `slot-${level}-${slotIndex}`;
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-lg w-full p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold">
                    Select Spell for ${level === 0 ? 'Cantrip' : `Level ${level}`} Slot
                </h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">×</button>
            </div>
            <div class="max-h-96 overflow-y-auto" id="slotSpellList">
                Loading spells...
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Filter spells for this level and current class/association
    const selectedClass = document.getElementById('classSelect').value;
    const selectedAssociation = document.getElementById('associationSelect').value;
    
    const availableSpells = allSpells.filter(spell => {
        const spellLevel = getSpellLevel(spell);
        if (spellLevel !== level) return false;
        
        // Apply class and association filters
        if (selectedClass !== "All") {
            const classObj = classData.find(item => item.class === selectedClass);
            if (!classObj) return false;
            
            if (selectedAssociation !== "All") {
                return (spell.traditions || []).includes(selectedAssociation) ||
                       (spell.traits || []).includes(selectedAssociation);
            }
        }
        return true;
    });
    
    // Render available spells
    const spellList = modal.querySelector('#slotSpellList');
    spellList.innerHTML = availableSpells.length ? '' : 'No spells available for this slot.';
    
    availableSpells.forEach(spell => {
        const spellDiv = document.createElement('div');
        spellDiv.className = 'p-2 hover:bg-gray-100 cursor-pointer';
        spellDiv.innerHTML = `
            <div class="font-medium">${spell.name}</div>
            <div class="text-sm text-gray-600">${spell.traits ? spell.traits.join(', ') : ''}</div>
        `;
        spellDiv.onclick = () => {
            assignSpellToSlot(slotId, spell);
            modal.remove();
            renderSpellSlots();
        };
        spellList.appendChild(spellDiv);
    });
}

// Function to assign a spell to a slot
function assignSpellToSlot(slotId, spell) {
    spellSlots[slotId] = {
        name: spell.name,
        level: getSpellLevel(spell),
        traditions: spell.traditions,
        traits: spell.traits
    };
    saveSpellSlots();
}

// Save spell slots to localStorage
function saveSpellSlots() {
    localStorage.setItem('spellSlots', JSON.stringify(spellSlots));
}

// Load spell slots from localStorage
function loadSpellSlots() {
    const saved = localStorage.getItem('spellSlots');
    if (saved) {
        spellSlots = JSON.parse(saved);
    }
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load saved spell slots
    loadSpellSlots();
    
    // Add event listener for view switching
    document.querySelectorAll('input[name="pageView"]').forEach(radio => {
        radio.addEventListener('change', (e) => switchView(e.target.value));
    });
});
