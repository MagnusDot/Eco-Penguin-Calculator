<template>
  <div class="grey-bg container-fluid">
    <section id="minimal-statistics">
      <div class="row">
        <div class="col-12 mt-3 mb-1">
          <h4 class="text-uppercase">Minimal Statistics Cards</h4>
          <p>Statistics on minimal cards.</p>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-3 col-sm-6 col-12">
          <div class="card">
            <div class="card-content">
              <div class="card-body">
                <div class="media d-flex">
                  <div class="align-self-center">
                    <i class="icon-pencil primary font-large-2 float-left"></i>
                  </div>
                  <div class="media-body text-right">
                    <h3>278</h3>
                    <span>New Posts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12">
          <div class="card">
            <div class="card-content">
              <div class="card-body">
                <div class="media d-flex">
                  <div class="align-self-center">
                    <i class="icon-speech warning font-large-2 float-left"></i>
                  </div>
                  <div class="media-body text-right">
                    <h3>156</h3>
                    <span>New Comments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  </div>
</template>
<script>
export default {
  name: "Home",
};
</script>
