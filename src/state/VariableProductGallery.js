import React, { Suspense } from "react";
import classnames from "classnames";

import { useWindowWidth } from "./windowWidth";

const Carousel = React.lazy(() => import(/* webpackChunkName: 'CarouselThumbnails' */ "./Carousel"));

function VariableProductGallery(props) {
  const { data } = props;
  const width = useWindowWidth();

  return (
    <div className="prod-gallery">
      <div class="prod-gallery-view">
        <figure class="prod-gallery-fig">
          {data.thumbnail ? (
            <img
              className="prod-thumbnail"
              src={data.thumbnail.main_size[0]}
              width={data.thumbnail.main_size[1]}
              height={data.thumbnail.main_size[2]}
            />
          ) : (
            ""
          )}
          {data.attr_data
            ? Object.entries(data.attr_data.pa_color).map(el => (
                <img
                  className={classnames("prod-col-img", { active: props.currentCol === el[0] })}
                  src={el[1].image_full[0]}
                  width={el[1].image_full[1]}
                  height={el[1].image_full[2]}
                />
              ))
            : ""}
          {data.attr_data
            ? Object.entries(data.attr_data.pa_surface).map(el => (
                <img
                  className={classnames("prod-surf-img", { active: props.currentSurf === el[0] })}
                  src={el[1].image_full[0]}
                  width={el[1].image_full[1]}
                  height={el[1].image_full[2]}
                />
              ))
            : ""}
        </figure>
      </div>
      {width > 1200 ? (
        <Suspense fallback={null}>
          <Carousel ref={props.refProp} thumbImgs={props.thumbImgs} onThumbClick={props.onThumbClick} />
        </Suspense>
      ) : (
        ""
      )}
    </div>
  );
}
export default VariableProductGallery;
