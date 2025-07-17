/**
 * Course Resources - Collapsible Week Sections
 * Enhanced search and navigation functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeSearch();
    initializeCollapsibleSections();
    initializeAccessibility();
    initializeAnalytics();
});

/**
 * Enhanced Search Functionality
 */
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        performSearch(searchTerm);
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Escape to clear search
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            performSearch('');
        }
    });
}

/**
 * Perform search across all resources
 */
function performSearch(searchTerm) {
    const resourceCards = document.querySelectorAll('.resource-card');
    const weekCollapsibles = document.querySelectorAll('.week-collapsible');
    let hasResults = false;
    
    // Clear previous highlights
    weekCollapsibles.forEach(collapsible => {
        collapsible.classList.remove('search-highlight');
    });
    
    if (searchTerm !== '') {
        // Open all collapsibles when searching
        weekCollapsibles.forEach(collapsible => {
            collapsible.setAttribute('open', '');
        });
        
        // Search through resources
        resourceCards.forEach(card => {
            const title = card.querySelector('.resource-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.resource-description')?.textContent.toLowerCase() || '';
            const type = card.querySelector('.resource-type')?.textContent.toLowerCase() || '';
            
            const isMatch = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          type.includes(searchTerm);
            
            if (isMatch) {
                showCard(card);
                highlightParentWeek(card);
                hasResults = true;
            } else {
                hideCard(card);
            }
        });
        
        // Show "no results" message if needed
        toggleNoResultsMessage(!hasResults, searchTerm);
        
    } else {
        // Reset all cards when search is cleared
        resourceCards.forEach(card => showCard(card));
        toggleNoResultsMessage(false);
    }
}

/**
 * Show resource card with animation
 */
function showCard(card) {
    card.style.display = 'block';
    card.style.opacity = '1';
    card.style.transform = 'scale(1)';
    card.style.filter = 'none';
}

/**
 * Hide resource card with animation
 */
function hideCard(card) {
    card.style.opacity = '0.3';
    card.style.transform = 'scale(0.95)';
    card.style.filter = 'grayscale(0.5)';
}

/**
 * Highlight the week section containing matching results
 */
function highlightParentWeek(card) {
    const weekSection = card.closest('.week-collapsible');
    if (weekSection) {
        weekSection.classList.add('search-highlight');
    }
}

/**
 * Show/hide no results message
 */
function toggleNoResultsMessage(show, searchTerm = '') {
    let noResultsMsg = document.getElementById('no-results-message');
    
    if (show && !noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'no-results-message';
        noResultsMsg.className = 'note-box';
        noResultsMsg.innerHTML = `
            <strong>No results found</strong> for "${searchTerm}"<br>
            <small>Try different keywords or browse all weeks below.</small>
        `;
        
        const firstWeek = document.querySelector('.week-collapsible');
        if (firstWeek) {
            firstWeek.parentNode.insertBefore(noResultsMsg, firstWeek);
        }
        
    } else if (!show && noResultsMsg) {
        noResultsMsg.remove();
    }
}

/**
 * Initialize collapsible section functionality
 */
function initializeCollapsibleSections() {
    const summaries = document.querySelectorAll('.week-summary');
    
    summaries.forEach(summary => {
        // Add click handler for smooth scrolling
        summary.addEventListener('click', function(e) {
            // Small delay to allow the details element to open/close
            setTimeout(() => {
                const rect = this.getBoundingClientRect();
                const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
                
                if (!isInView) {
                    this.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start',
                        inline: 'nearest'
                    });
                }
            }, 100);
        });
        
        // Add keyboard navigation
        summary.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const details = this.closest('.week-collapsible');
                details.open = !details.open;
            }
        });
        
        // Make summary focusable for keyboard navigation
        summary.setAttribute('tabindex', '0');
    });
    
    // Track open/close events for analytics
    const collapsibles = document.querySelectorAll('.week-collapsible');
    collapsibles.forEach((collapsible, index) => {
        collapsible.addEventListener('toggle', function() {
            trackWeekInteraction(index + 1, this.open ? 'expand' : 'collapse');
        });
    });
}

/**
 * Enhance accessibility
 */
function initializeAccessibility() {
    // Add ARIA labels to improve screen reader experience
    const summaries = document.querySelectorAll('.week-summary');
    summaries.forEach((summary, index) => {
        const weekNumber = index + 1;
        summary.setAttribute('aria-label', `Week ${weekNumber} resources. Click to expand or collapse.`);
        summary.setAttribute('role', 'button');
        
        const collapsible = summary.closest('.week-collapsible');
        collapsible.setAttribute('aria-labelledby', `week-${weekNumber}-summary`);
        summary.id = `week-${weekNumber}-summary`;
    });
    
    // Add skip navigation
    addSkipNavigation();
}

/**
 * Add skip navigation for accessibility
 */
function addSkipNavigation() {
    const skipNav = document.createElement('div');
    skipNav.className = 'skip-navigation';
    skipNav.innerHTML = `
        <a href="#main-content" class="skip-link">Skip to main content</a>
        <a href="#search-input" class="skip-link">Skip to search</a>
    `;
    
    document.body.insertBefore(skipNav, document.body.firstChild);
    
    // Add styles for skip links
    const skipStyles = document.createElement('style');
    skipStyles.textContent = `
        .skip-navigation {
            position: absolute;
            top: -100px;
            left: 0;
            z-index: 1000;
        }
        .skip-link {
            position: absolute;
            top: 0;
            left: 0;
            background: var(--primary-color);
            color: white;
            padding: 0.5rem 1rem;
            text-decoration: none;
            border-radius: 0 0 4px 0;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
        }
        .skip-link:focus {
            transform: translateY(0);
        }
    `;
    document.head.appendChild(skipStyles);
}

/**
 * Analytics and usage tracking (privacy-friendly)
 */
function initializeAnalytics() {
    // Track page load
    trackEvent('page_load', {
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop'
    });
    
    // Track resource clicks
    const resourceLinks = document.querySelectorAll('.resource-card a');
    resourceLinks.forEach(link => {
        link.addEventListener('click', function() {
            const card = this.closest('.resource-card');
            const resourceType = card.querySelector('.resource-type')?.textContent || 'unknown';
            const resourceTitle = card.querySelector('.resource-title')?.textContent || 'unknown';
            
            trackEvent('resource_click', {
                type: resourceType,
                title: resourceTitle,
                url: this.href
            });
        });
    });
}

/**
 * Track week interactions
 */
function trackWeekInteraction(weekNumber, action) {
    trackEvent('week_interaction', {
        week: weekNumber,
        action: action,
        timestamp: new Date().toISOString()
    });
}

/**
 * Generic event tracking (stores locally, no external services)
 */
function trackEvent(eventName, data) {
    // Store analytics locally for privacy
    try {
        const analytics = JSON.parse(localStorage.getItem('course_analytics') || '[]');
        analytics.push({
            event: eventName,
            data: data,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 100 events to avoid storage bloat
        if (analytics.length > 100) {
            analytics.splice(0, analytics.length - 100);
        }
        
        localStorage.setItem('course_analytics', JSON.stringify(analytics));
    } catch (e) {
        // Fail silently if localStorage is not available
        console.debug('Analytics tracking unavailable');
    }
}

/**
 * Utility function to expand/collapse all weeks
 */
function toggleAllWeeks(expand = true) {
    const collapsibles = document.querySelectorAll('.week-collapsible');
    collapsibles.forEach(collapsible => {
        collapsible.open = expand;
    });
}

/**
 * Utility function to navigate to specific week
 */
function navigateToWeek(weekNumber) {
    const weekCollapsible = document.querySelector(`.week-collapsible:nth-child(${weekNumber})`);
    if (weekCollapsible) {
        weekCollapsible.open = true;
        weekCollapsible.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

// Export functions for external use
window.CourseResources = {
    toggleAllWeeks,
    navigateToWeek,
    performSearch
};