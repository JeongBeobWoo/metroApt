import { Card, CardBody } from "@material-tailwind/react";
import { useState, useEffect, useRef } from "react";
import svgPanZoom from "svg-pan-zoom";

export function MetroApt() {
  const [svgContent, setSvgContent] = useState("");
  const [isSvgLoaded, setIsSvgLoaded] = useState(false); // SVG 로딩 여부 확인
  const svgContainerRef = useRef(null); // SVG 컨테이너 참조
  const panZoomInstance = useRef(null); // svgPanZoom 인스턴스

  // SVG 파일을 불러오기
  useEffect(() => {
    fetch("/img/Seoul_subway_linemap_ko.svg")
      .then((response) => response.text())
      .then((data) => {
        setSvgContent(data);
        setIsSvgLoaded(true); // SVG가 로드되었음을 표시
      })
      .catch((error) => console.error("SVG 불러오기 오류:", error));
  }, []);

  useEffect(() => {
    if (isSvgLoaded && svgContainerRef.current) {
      // SVG가 로드된 후, 클릭 이벤트를 추가
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, "image/svg+xml");

      // ✅ svgPanZoom 적용 (확대/축소 기능)
      const svgElement = svgContainerRef.current.querySelector("svg"); // SVG 요소 직접 선택
      if (svgElement && !panZoomInstance.current) {
        panZoomInstance.current = svgPanZoom(svgElement, {
          zoomEnabled: true,
          controlIconsEnabled: true,
          fit: true,
          center: true,
        });
      }

      // 📌 마우스 오버 시 글씨 크기 변경
      const stationElements = doc.querySelectorAll("text, tspan");

      stationElements.forEach((element) => {
        element.style.cursor = "pointer";
        element.addEventListener("mouseenter", () => {
          element.setAttribute("font-size", "30px");
          if (element.tagName === "tspan") {
            element.parentElement.setAttribute("font-size", "30px");
          }
        });

        element.addEventListener("mouseleave", () => {
          element.setAttribute("font-size", "20px");
          if (element.tagName === "tspan") {
            element.parentElement.setAttribute("font-size", "20px");
          }
        });

        // 📌 클릭 이벤트 추가 (역 클릭 시 알림)
        element.addEventListener("click", () => {
          // alert(`역 클릭됨: ${element.textContent.trim()}`);
          console.log("element.textContent == ", element.textContent);
          console.log(`역 클릭됨: ${element.textContent.trim()}`);
        });
      });

      // 📌 SVG 업데이트
      setSvgContent(new XMLSerializer().serializeToString(doc));
    }
  }, [isSvgLoaded]); // SVG가 로드된 후 실행

  // 📌 **SVG 클릭 이벤트를 감싸는 div에 적용하여 이벤트 위임**
  const handleSvgClick = (event) => {
    let target = event.target;
    
    while (target && target.tagName !== "text" && target.tagName !== "tspan") {
      target = target.parentElement;
    }

    if (target) {
      console.log("element.textContent == ", target.textContent);
      console.log(`역 클릭됨: ${target.textContent.trim()}`);
      alert(`역 클릭됨: ${target.textContent.trim()}`);
    }
  };

  return (
    <>
      {/* <div className="relative mt-8 h-36 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div> */}
      <div className="relative w-full">
      <div className="pt-16">
      {/* <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100"> */}
      <Card className="mx-3 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div 
            className="max-h-[500px] overflow-auto border border-gray-300 rounded-md"
            style={{ width: "100%", minHeight: "500px", overflow: "auto" }} // 추가된 스타일
            onClick={handleSvgClick} // ✅ SVG 클릭 이벤트 위임
          >
            <div 
              ref={svgContainerRef} // Ref를 이용하여 svgPanZoom 적용
              dangerouslySetInnerHTML={{ __html: svgContent }} 
              className="w-full h-auto"
            />
          </div>
        </CardBody>
      </Card>
      </div>
      </div>
    </>
  );
}

export default MetroApt;
