import React, { Component } from "react";
import classnames from "classnames";

import PhotoSwipe from "react-photoswipe";

// const PhotoSwipePromise = import( /* webpackChunkName: 'PhotoSwipeGalleryTab' */ "react-photoswipe")
// const PhotoSwipe = React.lazy( () => import( /* webpackChunkName: 'PhotoSwipeGalleryTab' */ "react-photoswipe"));

import "react-photoswipe/lib/photoswipe.css";
// import Svg from "./Svg";

class ProductTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: Object.keys(this.props.tabs)[0],
      currTabNum: 0,
      psOptions: {},
      isOpenPS: false,
      psItems: [],
    };
  }

  componentDidMount() {
    if (this.props.tabs.prod_gallery) {
      const psItems = this.props.tabs.prod_gallery.map((el) => ({
        src: el.url,
        w: el.width,
        h: el.height,
      }));
      this.setState({
        psItems: psItems,
      });
    }
    this.initVc();
  }

  psClick = (e, i) => {
    e.preventDefault();
    this.setState({ psOptions: { index: i }, isOpenPS: true });
  };

  handlePSClose = () => {
    this.setState({ isOpenPS: false });
  };

  onClickTab = (el, i) => {
    this.setState({
      currentTab: el,
      currTabNum: i,
    });
  };

  initVc = () => {
    if (typeof window.vc_js === "function")
      window.jQuery(document).ready(function () {
        window.vc_js();
      });
  };

  render() {
    const { currentTab, psOptions, isOpenPS, psItems, currTabNum } = this.state;
    const { tabs } = this.props;
    const {
      prod_files,
      prod_desc,
      prod_dimensions,
      prod_info,
      prod_gallery,
      prod_details,
      prod_video,
    } = this.props.tabs;

    let currentTabs = {
      prod_desc: "Подробно описание",
      prod_details: "Технически характеристики",
      prod_dimensions: "Размери",
      prod_info: "Допълнителна информация",
      prod_files: "Файлове",
      prod_video: "Видео",
      prod_gallery: "Галерия",
    };

    Object.keys(currentTabs).forEach((el) => {
      if (!tabs[el]) {
        delete currentTabs[el];
      }
    });

    let jsxTabs = [];

    if (currentTabs.hasOwnProperty("prod_desc")) {
      jsxTabs.push(
        <div
          key="prod_desc"
          hidden={currentTab !== "prod_desc"}
          className="product-tab-content prod_desc"
          dangerouslySetInnerHTML={{ __html: prod_desc }}
        />
      );
    }

    if (currentTabs.hasOwnProperty("prod_dimensions")) {
      jsxTabs.push(
        <div
          key="prod_dimensions"
          hidden={currentTab !== "prod_dimensions"}
          className="product-tab-content prod_dimensions"
          dangerouslySetInnerHTML={{ __html: prod_dimensions }}
        />
      );
    }

    if (currentTabs.hasOwnProperty("prod_details")) {
      jsxTabs.push(
        <div
          key="prod_details"
          hidden={currentTab !== "prod_details"}
          className="product-tab-content prod_details">
          <div className="prod-details-table">
            {prod_details.map((el, i) => (
              <div key={i} className="prod-details-row">
                <div className="prod-details-name">{el.name}</div>
                <div className="prod-details-value">{el.value}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (currentTabs.hasOwnProperty("prod_info")) {
      jsxTabs.push(
        <div
          key="prod_info"
          hidden={currentTab !== "prod_info"}
          className="product-tab-content prod_info">
          {prod_info}
        </div>
      );
    }

    if (currentTabs.hasOwnProperty("prod_files")) {
      jsxTabs.push(
        <div
          key="prod_files"
          hidden={currentTab !== "prod_files"}
          className="product-tab-content prod_files">
          {prod_files.map((el, i) =>
            el ? (
              <div key={i} className="prod-file">
                <a href={el.product_file.url} target="_blank">
                  <img src={el.product_file.icon} />
                  <span>
                    {el.product_file.title} - ({el.product_file.subtype},{" "}
                    {Math.round((el.product_file.filesize / 1024 / 1024) * 100) / 100} Mb)
                  </span>
                </a>
              </div>
            ) : (
              ""
            )
          )}
        </div>
      );
    }

    if (currentTabs.hasOwnProperty("prod_video")) {
      jsxTabs.push(
        <div
          key="prod_video"
          hidden={currentTab !== "prod_video"}
          className="product-tab-content prod_video">
          {prod_video.map((el, i) =>
            el.product_video_url !== "" ? (
              <div key={i} dangerouslySetInnerHTML={{ __html: el.product_video_url }} />
            ) : (
              ""
            )
          )}
        </div>
      );
    }

    if (currentTabs.hasOwnProperty("prod_gallery")) {
      jsxTabs.push(
        <div
          key="prod_gallery"
          hidden={currentTab !== "prod_gallery"}
          className="product-tab-content prod_gallery">
          {prod_gallery.map((el, i) => (
            <img
              key={`imagePs${i}`}
              width={el.sizes["medium-width"]}
              height={el.sizes["medium-height"]}
              src={el.sizes["medium"]}
              onClick={(e) => this.psClick(e, i)}
            />
          ))}
          <PhotoSwipe
            isOpen={isOpenPS}
            items={psItems}
            onClose={this.handlePSClose}
            options={psOptions}
          />
        </div>
      );
    }

    const totalTabs = Object.keys(currentTabs).length;

    return (
      <div className="product-tabs-section">
        <div className="prod-tabs">
          <div className="container" style={{ height: `${totalTabs * 45}px` }}>
            {Object.keys(currentTabs).map((el, i) => (
              <div
                key={`tab_${i}`}
                style={{
                  transform: `translateY(${
                    currTabNum === i ? (totalTabs - i - 1) * 100 : currTabNum > i ? 0 : 1 * -100
                  }%)`,
                }}
                className={classnames("tab-header", { active: currentTab === el }, el)}
                onClick={() => this.onClickTab(el, i)}>
                {currentTabs[el]}
              </div>
            ))}
          </div>
        </div>

        <div className="container">{jsxTabs}</div>
      </div>
    );
  }
}

export default ProductTabs;
