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

  color: ${({ $active }) => ($active ? "#ffffffff" : "rgba(255,255,255,.45)")};

  transition: all 0.35s ease;
`;

export const TimelineDot = styled.div`
  width: ${({ $active }) => ($active ? "14px" : "10px")};
  height: ${({ $active }) => ($active ? "14px" : "10px")};

  border-radius: 50%;

  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, #0008ffff,#111111)"
      : "rgba(19, 19, 227, 0.8)"};

  box-shadow: ${({ $active }) =>
    $active ? "0 0 18px rgba(70, 33, 255, 0.9)" : "none"};

  transition: all 0.35s ease;
`;

export const TimelineLine = styled.div`
  width: 2px;
  height: 26px;

  margin: 8px 0;

  border-radius: 999px;

  background: ${({ $active }) =>
    $active ? "linear-gradient(#f0f0f0,#031231)" : "rgba(255,255,255,.18)"};

  transition: background 0.35s ease;
`;
