const progressBar = document.getElementById("progress-bar");
const plane = document.getElementById("plane");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY; // how far we scrolled
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = scrollTop / docHeight;

  // Set width of the bar
  progressBar.style.width = (scrollPercent * 100) + "%";

  // Move the plane
  const containerWidth = document.querySelector('.progress-container').offsetWidth;
  plane.style.left = (scrollPercent * containerWidth) + "px";
});

(function(){
  const fill = document.getElementById('progressFill');
  const plane = document.getElementById('progressPlane');
  const track = document.getElementById('progressTrack');
  const progressBarParent = document.querySelector('.top-progress-wrapper');

  let lastKnownScrollY = window.scrollY;
  let ticking = false;
  let displayedPercent = 0; // smoothed percent for the UI
  const smoothing = 0.18;   // 0 (no smoothing) -> 1 (instant snap). small = smoother

  function getScrollPercent(){
    // compute percent of document scrolled (0..100)
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    const winHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollable = Math.max(docHeight - winHeight, 1); // avoid divide by zero
    const fraction = Math.min(Math.max(scrollTop / scrollable, 0), 1);
    return fraction * 100;
  }

  function updateOnce(){
    const targetPercent = getScrollPercent();
    // Smooth the visual percent toward the target
    displayedPercent += (targetPercent - displayedPercent) * smoothing;

    // Update ARIA value (rounded)
    const ariaValue = Math.round(displayedPercent);
    track.setAttribute('aria-valuenow', ariaValue);

    // Update fill width
    fill.style.width = ariaValue + '%';

    // Position the plane at the end of the fill
    positionPlane(ariaValue);

    ticking = false;
  }

  function positionPlane(percent){
    // compute available width within the track (in pixels)
    const trackRect = track.getBoundingClientRect();
    const planeRect = plane.getBoundingClientRect();
    const trackWidth = trackRect.width;
    const planeWidth = planeRect.width || parseFloat(getComputedStyle(plane).width);

    // Compute left position in px for the leading edge of fill:
    // target position = percent/100 * trackWidth
    // we center the plane horizontally over the leading edge (using translateX(-50%))
    // but we must clamp so the plane stays fully inside the track container
    const posPx = (percent/100) * trackWidth;

    // Clamp to keep plane inside track:
    const minLeft = planeWidth * 0.5; // half plane so translate(-50%) doesn't push off
    const maxLeft = trackWidth - planeWidth * 0.5;

    // if progress is 0, we put the plane at the very start (but visible)
    let clamped = Math.max(minLeft, Math.min(maxLeft, posPx));
    // convert to percentage relative to track width for CSS left property
    const leftPct = (clamped / trackWidth) * 100;

    plane.style.left = leftPct + '%';

    // optional tilt / lift effect based on speed: small rotation when moving faster
    // We'll approximate speed by difference between target and displayed percent
    const delta = percent - displayedPercent;
    const tilt = Math.max(-12, Math.min(12, delta * 0.6));
    plane.style.transform = `translate(-50%, -50%) rotate(${tilt - 8}deg)`;
  }

  // Use rAF loop that will run updates smoothly while user scrolls.
  function rafLoop(){
    if (!ticking){
      ticking = true;
      requestAnimationFrame(function tick(){
        updateOnce();
        // continue the rAF loop only while progress hasn't settled,
        // otherwise stop and wait for next scroll/resize to resume.
        if (Math.abs(getScrollPercent() - displayedPercent) > 0.1) {
          requestAnimationFrame(tick);
        } else {
          // final snap to exact value to avoid tiny differences
          displayedPercent = getScrollPercent();
          updateOnce();
          ticking = false;
        }
      });
    }
  }

  // event handlers
  window.addEventListener('scroll', function(){ lastKnownScrollY = window.scrollY; rafLoop(); }, {passive: true});
  window.addEventListener('resize', function(){ rafLoop(); }, {passive: true});

  // Initial layout (in case the page starts scrolled)
  document.addEventListener('DOMContentLoaded', function(){
    displayedPercent = getScrollPercent();
    updateOnce();
  });

  // Also run a quick update in case script is placed after content
  updateOnce();
})();