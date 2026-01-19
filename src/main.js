import './style.css'

console.log('Landing page loaded');

// Validation and Navigation Logic
window.currentStep = 1;

window.nextStep = function (step) {
    // 1. Get current step element
    const currentStepEl = document.getElementById(`step-${step}`);
    if (!currentStepEl) {
        console.error(`Step ${step} not found`);
        return;
    }

    // 2. Validate inputs
    const inputs = currentStepEl.querySelectorAll('input[required]');
    let isValid = true;

    if (inputs.length > 0) {
        // Radio Groups
        if (inputs[0].type === 'radio') {
            const checked = currentStepEl.querySelector('input[type="radio"]:checked');
            if (!checked) isValid = false;
        }
        // Text Inputs
        else {
            inputs.forEach(input => {
                if (!input.value.trim()) isValid = false;
            });
        }
    }

    if (!isValid) {
        alert('الرجاء اختيار إجابة أو ملء الحقل للمتابعة');
        return;
    }

    // 3. Transition
    // Hide current
    currentStepEl.classList.remove('active');

    // Show next
    const nextStepEl = document.getElementById(`step-${step + 1}`);
    if (nextStepEl) {
        nextStepEl.classList.add('active');
        window.currentStep = step + 1;
    }
};

window.prevStep = function (step) {
    const currentStepEl = document.getElementById(`step-${step}`);
    const prevStepEl = document.getElementById(`step-${step - 1}`);

    if (currentStepEl && prevStepEl) {
        currentStepEl.classList.remove('active');
        prevStepEl.classList.add('active');
        window.currentStep = step - 1;
    }
};

// Handle form submission
const consultationForm = document.getElementById('consultationForm');
if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Form submitted!');

        // Track lead conversion with Facebook Pixel
        if (typeof fbq === 'function') {
            fbq('track', 'Lead');
            console.log('Lead event tracked');
        }

        // Get form data
        const formData = new FormData(consultationForm);
        const projectType = formData.get('projectType');
        const area = formData.get('area');
        const name = formData.get('name');
        const phone = formData.get('phone');

        console.log('Form data:', { projectType, area, name, phone });

        // Prepare webhook payload
        const webhookData = {
            client_code: "861288b3f4d00e3dcaea10fc8d6b8dad",
            full_name: name,
            phone: phone,
            worktype: projectType,
            stage: area
        };

        console.log('Sending webhook data:', webhookData);

        // Send using XMLHttpRequest (better CORS support)
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://hook.eu2.make.com/lamihs63e4izhnt4sfg5e74weipetewf', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            console.log('Webhook response:', xhr.status, xhr.responseText);
            window.location.href = '/thankyou.html';
        };

        xhr.onerror = function () {
            console.error('Webhook error');
            // Still redirect even on error
            window.location.href = '/thankyou.html';
        };

        xhr.send(JSON.stringify(webhookData));
    });
}

// Smooth scroll logic
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
