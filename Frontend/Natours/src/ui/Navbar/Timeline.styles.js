import styled from "styled-components";

export const TimelineWrapper = styled.div`
  height: 560px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 0;
`;

export const TimelineItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  cursor: pointer;

  user-select: none;
`;

export const TimelineNumber = styled.span`
  margin-bottom: 10px;

  font-size: ${({ $active }) => ($active ? "1rem" : ".9rem")};

  font-weight: ${({ $active }) => ($active ? "700" : "500")};

  color: ${({ $active }) => ($active ? "#ffffff" : "rgba(255,255,255,.45)")};

  transition: all 0.35s ease;
`;

export const TimelineDot = styled.div`
  width: ${({ $active }) => ($active ? "14px" : "10px")};
  height: ${({ $active }) => ($active ? "14px" : "10px")};

  border-radius: 50%;

  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg,#3b82f6,#2563eb)"
      : "rgba(255,255,255,.25)"};

  box-shadow: ${({ $active }) =>
    $active ? "0 0 18px rgba(59,130,246,.45)" : "none"};

  transition: all 0.35s ease;
`;

export const TimelineLine = styled.div`
  width: 2px;
  height: 65px;

  margin: 8px 0;

  border-radius: 999px;

  background: ${({ $active }) =>
    $active ? "linear-gradient(#3b82f6,#2563eb)" : "rgba(255,255,255,.18)"};

  transition: background 0.35s ease;
`;
