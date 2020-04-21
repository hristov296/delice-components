import React, { Suspense, useState } from "react";
// import classnames from "classnames";

import PhotoSwipe from "react-photoswipe";
import "react-photoswipe/lib/photoswipe.css";

const Carousel = React.lazy(() => import(/* webpackChunkName: 'CarouselThumbnails' */ "./Carousel"));

function VariableProductGallery(props) {
  const [currentImg, updateImg] = useState(0);
  const [isOpenPS, handlePSState] = useState(false);
  const [psOptions, updatePSOptions] = useState({});

  const { thumbImgs } = props;

  const carItems = thumbImgs.map(el => ({
    src: el.thumb_size[0],
    w: el.thumb_size[1],
    h: el.thumb_size[2],
  }));
  const psItems = thumbImgs.map(el => ({
    src: el.full_size[0],
    w: el.full_size[1],
    h: el.full_size[2],
  }));

  return (
    <div className="prod-gallery">
      <div class="prod-gallery-view">
        <figure class="prod-gallery-fig">
          <img
            onClick={() => (updatePSOptions({ index: currentImg }), handlePSState(true))}
            className="prod-thumbnail"
            src={thumbImgs[currentImg].main_size[0]}
            width={thumbImgs[currentImg].main_size[1]}
            height={thumbImgs[currentImg].main_size[2]}
          />
        </figure>
        {thumbImgs.length > 1 ? (
          <Suspense fallback={null}>
            <Carousel thumbImgs={carItems} initialThumb={0} onThumbClick={(el, i) => updateImg(i)} />
          </Suspense>
        ) : (
          ""
        )}
      </div>
      <PhotoSwipe isOpen={isOpenPS} items={psItems} onClose={() => handlePSState(false)} />
    </div>
  );
}
export default VariableProductGallery;
