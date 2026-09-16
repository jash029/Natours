import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(17, 24, 39, 0.7);
  }
  70% {
    box-shadow: 0 0 0 14px rgba(17, 24, 39, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(17, 24, 39, 0);
  }
`;

export const MapCard = styled.div`
  background: #060606ff;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
`;

export const MapHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const MapTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 600;
  color: #247ee4ff;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background-color: black;

`;

export const JourneyBadge = styled.span`
  padding: 0.5rem 1.3rem;
  border-radius: 999px;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: #d8dfecff;
  color: #0a0c12ff;
  border: 1px solid #dbe0ebff;
`;

export const MapContainerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 560px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  pointer-events: none; /* Zero user interactivity on the map */

  /* Leaflet White Theme Styling */
  .leaflet-container {
    width: 100%;
    height: 100%;
    background: #f8fafc !important;
    font-family: inherit;
    pointer-events: none !important;
  }

  /* Custom Proper Teardrop Marker Pin */
  .custom-proper-marker {
    background: transparent;
    border: none;
    pointer-events: none;
  }

  .pin-marker-wrapper {
    position: relative;
    width: 44px;
    height: 52px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pin-marker-body {
    width: 40px;
    height: 40px;
    border-radius: 50% 50% 50% 0;
    background: linear-gradient(135deg, #080b12ff 0%, #374151 100%);
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #ffffff;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    position: absolute;
    top: 0;
    transition: all 0.3s ease;
  }

  .pin-marker-body.active-pin {
    background: linear-gradient(135deg, #000000 0%, #1f2937 100%);
    border: 3.5px solid #ffffff;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
    transform: rotate(-45deg) scale(1.2);
  }

  .pin-marker-day {
    transform: rotate(45deg);
    color: #ffffff;
    font-weight: 800;
    font-size: 1.35rem;
  }

  .pin-marker-pulse {
    position: absolute;
    bottom: 2px;
    width: 14px;
    height: 14px;
    background: rgba(17, 24, 39, 0.85);
    border-radius: 50%;
    animation: ${pulse} 2s infinite;
  }

  /* Horizontal Well-Structured Tooltip */
  .leaflet-tooltip.custom-horizontal-tooltip {
    background: #ffffff !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 18px !important;
    color: #000000ff !important;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.18) !important;
    padding: 1.2rem 1.6rem !important;
    white-space: normal !important;
    pointer-events: none !important;
    width: clamp(320px, 45vw, 440px) !important;
  }

  .leaflet-tooltip-top:before {
    border-top-color: #ffffff !important;
  }

  .horizontal-tooltip-content {
    display: flex;
    align-items: center;
    gap: 1.4rem;
  }

  .tooltip-day-badge {
    padding: 0.8rem 1.1rem;
    border-radius: 12px;
    background: #000000ff;
    color: #ffffff;
    font-size: 1.3rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(17, 24, 39, 0.25);
  }

  .tooltip-info-block {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex: 1;
  }

  .tooltip-title {
    font-size: 1.55rem;
    font-weight: 700;
    color: #111827;
    line-height: 1.3;
  }

  .tooltip-desc {
    font-size: 1.25rem;
    color: #3a3e45ff;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tooltip-location {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 1.2rem;
    color: #454647ff;
    font-weight: 600;
    margin-top: 0.2rem;

    svg {
      color: #3e0eceff;
    }
  }
`;
