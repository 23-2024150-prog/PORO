// Store clocks in array
let clocks = [];

function addClock() {
    const select = document.getElementById('timezone-select');
    const timezone = select.value;

    if (!timezone) {
        alert('Please select a timezone');
        return;
    }

    // Check if timezone already exists
    if (clocks.some(clock => clock.timezone === timezone)) {
        alert('This timezone is already displayed');
        return;
    }

    // Add clock to array
    clocks.push({
        id: Date.now(),
        timezone: timezone
    });

    // Reset select
    select.value = '';

    // Render clocks
    renderClocks();
}

function removeClock(id) {
    clocks = clocks.filter(clock => clock.id !== id);
    renderClocks();
}

function clearAllClocks() {
    if (clocks.length === 0) {
        alert('No clocks to clear');
        return;
    }
    if (confirm('Remove all clocks?')) {
        clocks = [];
        renderClocks();
    }
}

function renderClocks() {
    const container = document.getElementById('clocks-container');
    container.innerHTML = '';

    clocks.forEach(clock => {
        const clockCard = document.createElement('div');
        clockCard.className = 'clock-card';
        clockCard.id = `clock-${clock.id}`;

        clockCard.innerHTML = `
            <button class="clock-remove" onclick="removeClock(${clock.id})">✕</button>
            <div class="clock-timezone">${formatTimezoneDisplay(clock.timezone)}</div>
            <div class="clock-time blink" data-clock-id="${clock.id}">--:--:--</div>
            <div class="clock-date" data-clock-id="${clock.id}">--/--/----</div>
            <div class="clock-offset" data-clock-id="${clock.id}">UTC offset: --</div>
        `;

        container.appendChild(clockCard);
        updateClockDisplay(clock.timezone, clock.id);
    });
}

function updateClockDisplay(timezone, id) {
    try {
        // Get current time in specified timezone
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const dateFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        const now = new Date();
        const timeString = formatter.format(now);
        const dateString = dateFormatter.format(now);

        // Calculate UTC offset
        const utcOffset = getUTCOffset(timezone, now);

        // Update time display
        const timeElement = document.querySelector(`[data-clock-id="${id}"]`);
        if (timeElement) {
            timeElement.textContent = timeString;
        }

        // Update date display
        const dateElement = document.querySelectorAll(`[data-clock-id="${id}"]`)[1];
        if (dateElement) {
            dateElement.textContent = dateString;
        }

        // Update offset display
        const offsetElement = document.querySelectorAll(`[data-clock-id="${id}"]`)[2];
        if (offsetElement) {
            offsetElement.textContent = `UTC offset: ${utcOffset}`;
        }
    } catch (e) {
        console.error(`Error updating clock for ${timezone}:`, e);
    }
}

function getUTCOffset(timezone, date) {
    // Create two date strings: one in UTC, one in the target timezone
    const utcFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const tzFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const utcTime = utcFormatter.format(date);
    const tzTime = tzFormatter.format(date);

    // Parse hours
    const utcHours = parseInt(utcTime.substring(0, 2));
    const tzHours = parseInt(tzTime.substring(0, 2));

    let offset = tzHours - utcHours;

    // Handle day boundary
    if (offset > 12) {
        offset -= 24;
    } else if (offset < -12) {
        offset += 24;
    }

    const sign = offset >= 0 ? '+' : '';
    return `${sign}${offset.toString().padStart(2, '0')}:00`;
}

function formatTimezoneDisplay(timezone) {
    // Convert timezone string to readable format
    return timezone
        .replace(/_/g, ' ')
        .split('/')
        .pop()
        .toUpperCase();
}

// Update all clocks every second
function updateAllClocks() {
    clocks.forEach(clock => {
        updateClockDisplay(clock.timezone, clock.id);
    });
}

// Initialize
setInterval(updateAllClocks, 1000);

// Add initial clock (UTC)
window.addEventListener('load', () => {
    clocks.push({
        id: Date.now(),
        timezone: 'UTC'
    });
    renderClocks();
});

// Add keyboard support
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const select = document.getElementById('timezone-select');
        if (document.activeElement === select) {
            addClock();
        }
    }
});